export function formatBreadcrumbSegment(segment) {
    // Skip ID or number
    if (!isNaN(Number(segment))) return ''
  
    const readable = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  
    return readable
  }
  
export function truncateWords(text, maxWords = 3) {
    const words = text.split(' ')
    if (words.length <= maxWords) return text
    return words.slice(0, maxWords).join(' ') + '...'
}
  