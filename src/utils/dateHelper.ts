// // export const formatDate = (
// //   date: Date
// // ): string => {
// //   return new Intl.DateTimeFormat(
// //     'en-CA',
// //     {
// //       timeZone: 'Asia/Kolkata',
// //       year: 'numeric',
// //       month: '2-digit',
// //       day: '2-digit',
// //     }
// //   ).format(date);
// // };

// export const formatDate = (date: Date | string | null | undefined): string => {
//   const parsedDate = new Date(date as any);

//   if (isNaN(parsedDate.getTime())) {
//     throw new Error(`Invalid date passed to formatDate: ${date}`);
//   }

//   return new Intl.DateTimeFormat('en-CA', {
//     timeZone: 'Asia/Kolkata',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).format(parsedDate);
// };

// export const getTodayDate = (): string => {
//   return formatDate(new Date());
// };

// // const formatDate = (date) => {
// //   return new Intl.DateTimeFormat(
// //     'en-CA',
// //     {
// //       timeZone: 'Asia/Kolkata',
// //       year: 'numeric',
// //       month: '2-digit',
// //       day: '2-digit',
// //     }
// //   ).format(date);
// // };

// // const getTodayDate = () => {
// //   return formatDate(new Date());
// // };

// // module.exports = {
// //   formatDate,
// //   getTodayDate,
// // };



export const formatDate = (
  value: Date | string | null | undefined
): string => {
  if (!value) {
    throw new Error(`Invalid date passed to formatDate: ${value}`);
  }

  // Already correct for Sequelize DATEONLY
  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date passed to formatDate: ${value}`);
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error(`Could not format date: ${value}`);
  }

  return `${year}-${month}-${day}`;
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
};