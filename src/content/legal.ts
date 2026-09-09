/**
 * Who this is and how to reach them.
 *
 * Every legal page needs a name and an address to answer to, and neither of
 * those is something a build can invent. They are here rather than repeated
 * across three pages so there is one place to fill in — and so the pages
 * cannot disagree about who is selling.
 *
 * REPLACE BEFORE PUBLISHING. Terms with a placeholder for a seller are not
 * terms; they are a form somebody forgot to fill in, and the first person to
 * read them will trust the product less for it.
 */
export const SELLER = {
  /**
   * Legal name of the person or company selling.
   *
   * A trading name for now. EU and UK consumer law wants the trader's actual
   * identity — the name a court could serve papers on — so this is a stopgap
   * that stops the page saying TODO, not the finished answer.
   */
  name: 'Kuro',
  /**
   * Where notices can be sent.
   *
   * A country is not an address. The requirement is somewhere a letter
   * arrives: street, city, postal code. A registered-agent or mailbox service
   * satisfies it without putting a home address on a public page, which is
   * usually what somebody selling software on their own actually wants.
   */
  address: 'USA',
  /**
   * Reached within a working day or two, and actually read.
   *
   * Temporary: a personal inbox standing in until there is a support address.
   * It is on three public pages, so it will be scraped — worth replacing with
   * something you can filter before this gets much traffic.
   */
  email: 'kurodenjiro@gmail.com',
  /** For privacy requests, if different from the address above. */
  privacyEmail: 'kurodenjiro@gmail.com',
} as const;

/** When these were last changed, shown at the top of each page. */
export const UPDATED = '2026-09-09';

/**
 * Polar is the merchant of record, which is the fact these pages turn on.
 *
 * Polar is the seller of the subscription: they take the payment, they hold
 * the card details, and they owe the VAT in the buyer's country. This product
 * never sees a card number, and the refund route runs through them.
 */
export const MERCHANT = {
  name: 'Polar Software Inc.',
  url: 'https://polar.sh',
} as const;
