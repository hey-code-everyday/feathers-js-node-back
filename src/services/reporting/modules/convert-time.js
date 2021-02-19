module.exports = (time) => {

  const hours = Math.floor(time / 3600);
  const remainderSeconds = time%3600;
  const minutes = Math.floor(remainderSeconds / 60);
  const seconds = Math.round(remainderSeconds%60);

  if (hours > 0) {
    return hours + 'hr ' + minutes + 'm';
  }

  if (minutes > 0) {
    return minutes + 'm';
  }

  if (seconds > 0) {
    return seconds + 's';
  }

  return '0';
};
