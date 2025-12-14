const START_YEAR = 2025;

export function copyrightYears(startYear = START_YEAR) {
  const currentYear = new Date().getFullYear();
  return currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;
}
