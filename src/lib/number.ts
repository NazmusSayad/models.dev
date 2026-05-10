export function formatNumberIntoHumanReadable(input: number): string {
  const abs = Math.abs(input)
  if (abs < 1000) return input.toString()

  const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E']
  let magnitude = Math.floor(Math.log10(abs) / 3)
  let scaled = input / Math.pow(10, magnitude * 3)

  if (Math.abs(scaled) >= 999.95 && magnitude < suffixes.length - 1) {
    magnitude += 1
    scaled = input / Math.pow(10, magnitude * 3)
  }

  const suffix = suffixes[Math.min(magnitude, suffixes.length - 1)]
  return `${+scaled.toFixed(1)}${suffix}`
}
