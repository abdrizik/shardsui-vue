import type { TransitionStatus } from './transition-status'

export function getDisabledMountTransitionStyles(
  transitionStatus: TransitionStatus
): { transition: 'none' } | undefined {
  return transitionStatus === 'starting' ? { transition: 'none' } : undefined
}
