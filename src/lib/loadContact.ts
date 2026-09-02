import contactRaw from '../../content/contact.json'
import { pickText, type LocalizedString } from './localized'
import type { Lang } from '../i18n'

export type ContactContent = {
  eyebrow: LocalizedString
  title: LocalizedString
  addressLabel: LocalizedString
  addressLine1: LocalizedString
  addressLine2: LocalizedString
  phoneLabel: LocalizedString
  phone: string
  /** Explicit tel: target; derived from `phone` when left blank in the CMS. */
  phoneTel: string
  emailLabel: LocalizedString
  email: string
  hoursLabel: LocalizedString
  hours: LocalizedString
  formTitle: LocalizedString
  formLead: LocalizedString
  mapLat: number
  mapLng: number
  mapZoom: number
  showMap: boolean
}

export type RawContact = {
  eyebrowEn?: string
  eyebrowZh?: string
  titleEn?: string
  titleZh?: string
  addressLabelEn?: string
  addressLabelZh?: string
  addressLine1En?: string
  addressLine1Zh?: string
  addressLine2En?: string
  addressLine2Zh?: string
  phoneLabelEn?: string
  phoneLabelZh?: string
  phone?: string
  phoneTel?: string
  emailLabelEn?: string
  emailLabelZh?: string
  email?: string
  hoursLabelEn?: string
  hoursLabelZh?: string
  hoursEn?: string
  hoursZh?: string
  formTitleEn?: string
  formTitleZh?: string
  formLeadEn?: string
  formLeadZh?: string
  mapLat?: number
  mapLng?: number
  mapZoom?: number
  showMap?: boolean
}

function L(en?: string, zh?: string, fallback = ''): LocalizedString {
  const e = (en ?? '').trim() || (zh ?? '').trim() || fallback
  const z = (zh ?? '').trim() || e
  return { en: e, zh: z }
}

/** Turn a display number like "(425) 5590-9437" into a tel: target. */
export function telHref(phone: string, explicit?: string): string {
  const manual = (explicit ?? '').trim()
  if (manual) return manual.startsWith('+') ? manual : `+${manual.replace(/[^\d]/g, '')}`
  const digits = phone.replace(/[^\d]/g, '')
  if (!digits) return ''
  return digits.startsWith('1') ? `+${digits}` : `+1${digits}`
}

export function normalizeContact(raw: RawContact): ContactContent {
  const phone = (raw.phone ?? '').trim()
  return {
    eyebrow: L(raw.eyebrowEn, raw.eyebrowZh, 'Get in touch'),
    title: L(raw.titleEn, raw.titleZh, 'Contact Information'),
    addressLabel: L(raw.addressLabelEn, raw.addressLabelZh, 'Address'),
    addressLine1: L(raw.addressLine1En, raw.addressLine1Zh),
    addressLine2: L(raw.addressLine2En, raw.addressLine2Zh),
    phoneLabel: L(raw.phoneLabelEn, raw.phoneLabelZh, 'Phone'),
    phone,
    phoneTel: telHref(phone, raw.phoneTel),
    emailLabel: L(raw.emailLabelEn, raw.emailLabelZh, 'Email'),
    email: (raw.email ?? '').trim(),
    hoursLabel: L(raw.hoursLabelEn, raw.hoursLabelZh, 'Office Hours'),
    hours: L(raw.hoursEn, raw.hoursZh),
    formTitle: L(raw.formTitleEn, raw.formTitleZh, 'Send Us a Message'),
    formLead: L(raw.formLeadEn, raw.formLeadZh),
    mapLat: Number.isFinite(Number(raw.mapLat)) ? Number(raw.mapLat) : 47.6229,
    mapLng: Number.isFinite(Number(raw.mapLng)) ? Number(raw.mapLng) : -122.1725,
    mapZoom: Math.min(19, Math.max(1, Number(raw.mapZoom) || 15)),
    showMap: raw.showMap !== false,
  }
}

export const contactContent: ContactContent = normalizeContact(contactRaw as RawContact)

export function contactText(field: LocalizedString, lang: Lang, fallback = ''): string {
  return pickText(field, lang, fallback)
}
