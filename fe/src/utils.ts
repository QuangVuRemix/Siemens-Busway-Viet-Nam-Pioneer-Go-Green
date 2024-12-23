export function secondsToHHmm(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours.toString().padStart(1, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}h ${formattedMinutes}m`;
}