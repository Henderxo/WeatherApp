function formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
  }
  
export { formatUnixTimestamp };