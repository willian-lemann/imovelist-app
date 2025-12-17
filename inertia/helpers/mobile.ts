export function isMobile(): boolean {
  const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  return isMobileAgent || window.innerWidth <= 768
}
