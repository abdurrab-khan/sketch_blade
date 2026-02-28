export function getFormattedTime(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
}

export function getRandomColor(): string {
  // 1. Pick a random Hue from 0 to 360 (the full color wheel)
  const hue = Math.floor(Math.random() * 360);

  // 2. Set Saturation to a high percentage for "vibrancy" (70% - 90%)
  const saturation = 80;

  // 3. Set Lightness to a medium-high level so it looks like a highlight (50% - 70%)
  const lightness = 60;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
