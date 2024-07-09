import { computed, onBeforeMount } from 'vue'
import { isClient } from '@element-plus/utils'
import { useGetDerivedNamespace } from '../use-namespace'
import { useIdInjection } from '../use-id'
import { useAppRoot } from '../use-app-root'

export const usePopperContainerId = () => {
  const namespace = useGetDerivedNamespace()
  const idInjection = useIdInjection()
  const appRoot = useAppRoot()

  const id = computed(() => {
    return `${namespace.value}-popper-container-${idInjection.prefix}`
  })
  const selector = computed(() => `#${id.value}`)
  const target = computed(() => appRoot.querySelector(`#${id.value}`))

  return {
    id,
    selector,
    target,
  }
}

const createContainer = (appRoot: HTMLElement | ShadowRoot, id: string) => {
  const container = document.createElement('div')
  container.id = id
  appRoot.appendChild(container)
  return container
}

export const usePopperContainer = () => {
  const { id, selector } = usePopperContainerId()
  const appRoot = useAppRoot()
  onBeforeMount(() => {
    if (!isClient) return

    // This is for bypassing the error that when under testing env, we often encounter
    // document.body.innerHTML = '' situation
    // for this we need to disable the caching since it's not really needed
    if (
      process.env.NODE_ENV === 'test' ||
      (!appRoot.cachedContainer && !appRoot.querySelector(selector.value))
    ) {
      appRoot.cachedContainer = createContainer(appRoot, id.value)
    }
  })

  return {
    id,
    selector,
  }
}
