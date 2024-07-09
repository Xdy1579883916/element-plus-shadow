import { isClient, isElement } from '@element-plus/utils'

import type {
  ComponentPublicInstance,
  DirectiveBinding,
  ObjectDirective,
} from 'vue'

type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void
type FlushList = Map<
  HTMLElement,
  {
    documentHandler: DocumentHandler
    bindingFn: (...args: unknown[]) => unknown
  }[]
>

const nodeList: FlushList = new Map()

let startClick: MouseEvent

if (isClient) {
  document.addEventListener('mousedown', (e: MouseEvent) => (startClick = e))
  document.addEventListener('mouseup', (e: MouseEvent) => {
    for (const handlers of nodeList.values()) {
      for (const { documentHandler } of handlers) {
        documentHandler(e as MouseEvent, startClick)
      }
    }
  })
}

function createDocumentHandler(
  el: HTMLElement,
  binding: DirectiveBinding
): DocumentHandler {
  let excludes: HTMLElement[] = []
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg
  } else if (isElement(binding.arg)) {
    // due to current implementation on binding type is wrong the type casting is necessary here
    excludes.push(binding.arg as unknown as HTMLElement)
  }
  return function (mouseup, mousedown) {
    const popperRef = (
      binding.instance as ComponentPublicInstance<{
        popperRef: HTMLElement
      }>
    ).popperRef
    const mouseUpTarget = mouseup?.target as Element
    const mouseDownTarget = mousedown?.target as Element
    const isBound = !binding || !binding.instance
    const isTargetExists = !mouseUpTarget || !mouseDownTarget
    const isContainedByEl =
      el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget

    const isTargetExcluded =
      (excludes.length &&
        excludes.some((item) => item?.contains(mouseUpTarget))) ||
      (excludes.length && excludes.includes(mouseDownTarget as HTMLElement))
    const isContainedByPopper =
      popperRef &&
      (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget))
    // 如果是 ShadowDom, 另一种选择是检查事件光标相对于目标元素的偏移量：
    // @ts-ignore
    const pop: Element = binding.arg
    let isInside = false
    if (pop && (mouseUpTarget?.shadowRoot || mouseDownTarget?.shadowRoot)) {
      const { top, right, bottom, left } = pop.getBoundingClientRect()
      const { pageX, pageY } = mouseup
      isInside =
        pageX >= left && pageX <= right && pageY >= top && pageY <= bottom
    }

    if (
      isBound ||
      isTargetExists ||
      isContainedByEl ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper ||
      isInside
    ) {
      return
    }
    binding.value(mouseup, mousedown)
  }
}

const ClickOutside: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    // there could be multiple handlers on the element
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }

    nodeList.get(el)!.push({
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    })
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, [])
    }

    const handlers = nodeList.get(el)!
    const oldHandlerIndex = handlers.findIndex(
      (item) => item.bindingFn === binding.oldValue
    )
    const newHandler = {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    }

    if (oldHandlerIndex >= 0) {
      // replace the old handler to the new handler
      handlers.splice(oldHandlerIndex, 1, newHandler)
    } else {
      handlers.push(newHandler)
    }
  },
  unmounted(el: HTMLElement) {
    // remove all listeners when a component unmounted
    nodeList.delete(el)
  },
}

export default ClickOutside
