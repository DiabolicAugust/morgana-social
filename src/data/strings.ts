import { Entities, Fields } from './enums.js';

export const Strings = {
  fieldCantBeEmpty: (field: Fields) => `${field} can't be empty!`,
  fieldMustBeString: (field: Fields) => `${field} must be string!`,

  //errors
  entityWasNotFoundById: (entity: Entities, id: string | number) =>
    `${entity} was not found by this id: ${id}`,

  noEntityWithField: (entity: Entities, field: Fields, data: any) =>
    `There is no ${entity} with this ${field}: ${data}`,

  wrongField: (field: Fields) => `Wrong ${field}`,

  somethingWentWrong: 'Something went wrong!',
  entityDeleted: (entity: Entities) =>
    `${entity} has been successfully deleted`,

  entityUpdated: (entity: Entities) =>
    `${entity} has been successfully updated`,

  emailAlreadyVerified: 'This email is already verified!',
  emailVerifySuccess: 'Your email was successfully verified!',

  capitalizeFirstLetterAndRemoveSymbols(str) {
    const parts = str.split('-');

    const capitalizedParts = parts.map((part) => {
      const capitalizedPart = part.charAt(0).toUpperCase() + part.slice(1);
      return capitalizedPart;
    });

    const capitalizedStr = capitalizedParts.join('');

    return capitalizedStr;
  },

  objectWithFieldAlreadyExists: (entity: Entities, field: Fields) =>
    `${entity} with the same ${field.toLowerCase()} already exists. You can't add another one!`,
};
