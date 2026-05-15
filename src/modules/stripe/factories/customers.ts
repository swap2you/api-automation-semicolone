import { uniqueId } from '../../../core/data/builders.js';
import { randomEmail, randomName } from '../../../core/data/faker-helpers.js';

export function newCustomerForm() {
  return {
    name: randomName('API Auto'),
    email: randomEmail('stripe'),
    description: uniqueId('cust'),
  };
}
