import { useEffect, useState } from 'react'
import { PageHeader } from '../AdminApp'
import { getCopy, type AdminLang } from '../lib/i18n'
import { loadContentJson, saveContentFile } from '../lib/contentApi'
import { Field, ToggleField } from '../components/Fields'
import contactRaw from '../../../content/contact.json'
import { telHref, type RawContact } from '../../lib/loadContact'

export function ContactPageEditor({ lang }: { lang: AdminLang }) {
  const t = getCopy(lang)
  const zh = lang === 'zh'
  const lb = (en: string, cn: string) => (zh ? cn : en)
  const [data, setData] = useState<RawContact>(() => structuredClone(contactRaw as RawContact))
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    void loadContentJson('content/contact.json', contactRaw as RawContact).then((remote) => {
      if (!cancelled) setData(structuredClone(remote))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const set = <K extends keyof RawContact>(key: K, value: RawContact[K]) => {
    setData((d) => ({ ...d, [key]: value }))
  }

  const num = (key: 'mapLat' | 'mapLng' | 'mapZoom') => (v: string) => {
    const n = Number(v)
    set(key, v.trim() === '' || Number.isNaN(n) ? undefined : n)
  }

  const save = async () => {
    setBusy(true)
    setStatus('')
    const res = await saveContentFile('content/contact.json', data)
    setBusy(false)
    setStatus(res.ok ? t.saved : res.error)
  }

  const telPreview = telHref(data.phone ?? '', data.phoneTel)

  return (
    <>
      <PageHeader
        title={t.contact}
        action={
          <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={() => void save()}>
            {busy ? t.saving : t.save}
          </button>
        }
      />
      {status && <p className={`admin-status ${status === t.saved ? 'is-ok' : 'is-err'}`}>{status}</p>}

      <section className="admin-card">
        <h2>{lb('Page header', '页头')}</h2>
        <div className="admin-grid-2">
          <Field label={lb('Eyebrow (EN)', '眉标（英文）')} value={data.eyebrowEn ?? ''} onChange={(v) => set('eyebrowEn', v)} />
          <Field label={lb('Eyebrow (ZH)', '眉标（中文）')} value={data.eyebrowZh ?? ''} onChange={(v) => set('eyebrowZh', v)} />
          <Field label={lb('Title (EN)', '标题（英文）')} value={data.titleEn ?? ''} onChange={(v) => set('titleEn', v)} />
          <Field label={lb('Title (ZH)', '标题（中文）')} value={data.titleZh ?? ''} onChange={(v) => set('titleZh', v)} />
        </div>
      </section>

      <section className="admin-card">
        <h2>{lb('Address', '地址')}</h2>
        <div className="admin-grid-2">
          <Field
            label={lb('Line 1 (EN)', '第一行（英文）')}
            value={data.addressLine1En ?? ''}
            onChange={(v) => set('addressLine1En', v)}
            hint={lb('Street and suite', '街道与门牌')}
          />
          <Field
            label={lb('Line 1 (ZH)', '第一行（中文）')}
            value={data.addressLine1Zh ?? ''}
            onChange={(v) => set('addressLine1Zh', v)}
          />
          <Field
            label={lb('Line 2 (EN)', '第二行（英文）')}
            value={data.addressLine2En ?? ''}
            onChange={(v) => set('addressLine2En', v)}
            hint={lb('City, state ZIP', '城市、州与邮编')}
          />
          <Field
            label={lb('Line 2 (ZH)', '第二行（中文）')}
            value={data.addressLine2Zh ?? ''}
            onChange={(v) => set('addressLine2Zh', v)}
          />
          <Field
            label={lb('Label (EN)', '标签（英文）')}
            value={data.addressLabelEn ?? ''}
            onChange={(v) => set('addressLabelEn', v)}
          />
          <Field
            label={lb('Label (ZH)', '标签（中文）')}
            value={data.addressLabelZh ?? ''}
            onChange={(v) => set('addressLabelZh', v)}
          />
        </div>
      </section>

      <section className="admin-card">
        <h2>{lb('Phone, email & hours', '电话、邮箱与办公时间')}</h2>
        <div className="admin-grid-2">
          <Field
            label={lb('Phone (shown on site)', '电话（网站显示）')}
            value={data.phone ?? ''}
            onChange={(v) => set('phone', v)}
            hint={lb('Leave blank to hide the phone row', '留空则不显示电话一栏')}
          />
          <Field
            label={lb('Dial link (optional)', '拨号链接（可选）')}
            value={data.phoneTel ?? ''}
            onChange={(v) => set('phoneTel', v)}
            hint={
              telPreview
                ? lb(
                    `Auto: ${telPreview} — override only if the dial number differs.`,
                    `自动生成：${telPreview}，仅当实际拨号号码不同才需填写。`,
                  )
                : lb('E.164 format, e.g. +14255909437', 'E.164 格式，例如 +14255909437')
            }
          />
          <Field
            label={lb('Phone label (EN)', '电话标签（英文）')}
            value={data.phoneLabelEn ?? ''}
            onChange={(v) => set('phoneLabelEn', v)}
          />
          <Field
            label={lb('Phone label (ZH)', '电话标签（中文）')}
            value={data.phoneLabelZh ?? ''}
            onChange={(v) => set('phoneLabelZh', v)}
          />
          <Field
            label={lb('Email', '邮箱')}
            value={data.email ?? ''}
            onChange={(v) => set('email', v)}
            type="email"
            hint={lb('Leave blank to hide the email row', '留空则不显示邮箱一栏')}
          />
          <Field
            label={lb('Email label (EN)', '邮箱标签（英文）')}
            value={data.emailLabelEn ?? ''}
            onChange={(v) => set('emailLabelEn', v)}
          />
          <Field
            label={lb('Email label (ZH)', '邮箱标签（中文）')}
            value={data.emailLabelZh ?? ''}
            onChange={(v) => set('emailLabelZh', v)}
          />
          <Field
            label={lb('Office hours (EN)', '办公时间（英文）')}
            value={data.hoursEn ?? ''}
            onChange={(v) => set('hoursEn', v)}
          />
          <Field
            label={lb('Office hours (ZH)', '办公时间（中文）')}
            value={data.hoursZh ?? ''}
            onChange={(v) => set('hoursZh', v)}
          />
          <Field
            label={lb('Hours label (EN)', '办公时间标签（英文）')}
            value={data.hoursLabelEn ?? ''}
            onChange={(v) => set('hoursLabelEn', v)}
          />
          <Field
            label={lb('Hours label (ZH)', '办公时间标签（中文）')}
            value={data.hoursLabelZh ?? ''}
            onChange={(v) => set('hoursLabelZh', v)}
          />
        </div>
      </section>

      <section className="admin-card">
        <h2>{lb('Map', '地图')}</h2>
        <ToggleField
          label={lb('Show the office map', '显示办公室地图')}
          checked={data.showMap !== false}
          onChange={(v) => set('showMap', v)}
        />
        <div className="admin-grid-2">
          <Field
            label={lb('Latitude', '纬度')}
            value={data.mapLat == null ? '' : String(data.mapLat)}
            onChange={num('mapLat')}
            hint={lb(
              'Right-click the office in Google Maps and copy the first number',
              '在 Google 地图右键点击办公室位置，复制第一个数字',
            )}
          />
          <Field
            label={lb('Longitude', '经度')}
            value={data.mapLng == null ? '' : String(data.mapLng)}
            onChange={num('mapLng')}
          />
          <Field
            label={lb('Zoom (1-19)', '缩放级别（1-19）')}
            value={data.mapZoom == null ? '' : String(data.mapZoom)}
            onChange={num('mapZoom')}
          />
        </div>
      </section>

      <section className="admin-card">
        <h2>{lb('Message form', '留言表单')}</h2>
        <div className="admin-grid-2">
          <Field
            label={lb('Form title (EN)', '表单标题（英文）')}
            value={data.formTitleEn ?? ''}
            onChange={(v) => set('formTitleEn', v)}
          />
          <Field
            label={lb('Form title (ZH)', '表单标题（中文）')}
            value={data.formTitleZh ?? ''}
            onChange={(v) => set('formTitleZh', v)}
          />
          <Field
            label={lb('Form lead (EN)', '表单说明（英文）')}
            value={data.formLeadEn ?? ''}
            onChange={(v) => set('formLeadEn', v)}
            multiline
          />
          <Field
            label={lb('Form lead (ZH)', '表单说明（中文）')}
            value={data.formLeadZh ?? ''}
            onChange={(v) => set('formLeadZh', v)}
            multiline
          />
        </div>
        <p className="admin-field-hint">
          {lb(
            'Submissions arrive in Inbox. Field labels inside the form stay in the site translations.',
            '访客提交后可在「收件箱」查看。表单内部的字段名仍来自站点翻译。',
          )}
        </p>
      </section>
    </>
  )
}
