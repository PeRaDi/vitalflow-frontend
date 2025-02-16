interface ContanctDto {
  contact: number;
  info: string;
}

export default interface AddContactsDto {
  contacts: ContanctDto[];
}
