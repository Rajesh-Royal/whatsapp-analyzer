export const makeTimeStampUnique = (messages: any) => {
  let lastDate: Date | null = null;
  let ms = 0;

  return messages.map((message: any) => {
    const date = new Date(message.date);

    // if the date, month or year has changed, reset the milliseconds
    if (
      lastDate &&
      (date.getDate() !== lastDate.getDate() ||
        date.getMonth() !== lastDate.getMonth() ||
        date.getFullYear() !== lastDate.getFullYear())
    ) {
      ms = 0;
    }

    date.setMilliseconds(++ms);
    lastDate = date;

    return { ...message, date: date.toISOString() };
  });
};
