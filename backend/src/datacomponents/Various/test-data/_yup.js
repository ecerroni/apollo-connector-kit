import * as yup from 'yup';

export default {
  inputTest: yup.object().shape({
    yup: yup
      .number()
      .default(3)
      .min(2),
    text: yup
      .string()
      .trim()
      .lowercase()
      .length(4)
  })
};
