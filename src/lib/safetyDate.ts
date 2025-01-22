export function safelyFormatDate(dateString: string | undefined): string {
    if (!dateString) {
      return new Date().toISOString()
    }
  
    const date = new Date(dateString)
  
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}. Using current date instead.`)
      return new Date().toISOString()
    }
  
    return date.toISOString()
  }
  
  