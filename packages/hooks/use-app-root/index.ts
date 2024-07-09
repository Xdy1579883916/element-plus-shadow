import { inject } from 'vue'

export const defaultAppRoot: HTMLElement | ShadowRoot = document.body
export const useAppRoot = (
  customRoot?: HTMLElement | ShadowRoot
): HTMLElement | ShadowRoot | any => {
  return inject('appRoot', customRoot || defaultAppRoot)
}
