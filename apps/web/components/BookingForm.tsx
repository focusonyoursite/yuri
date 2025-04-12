'use client';

import { motion } from 'framer-motion'
import { useState } from 'react'
import { booking } from '../app/[locale]/boeken/actions/booking'

type FormData = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  notes: string
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string>()

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name) newErrors.name = 'Naam is verplicht'
    if (!formData.email) newErrors.email = 'E-mail is verplicht'
    if (!formData.date) newErrors.date = 'Datum is verplicht'
    if (!formData.time) newErrors.time = 'Tijd is verplicht'
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres'
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError(undefined)
    
    const result = await booking(
      formData.name,
      formData.email,
      formData.phone || undefined,
      formData.date,
      formData.time,
      formData.notes || undefined
    )

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset form na 3 seconden
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: ''
      })
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h3 className="text-2xl text-green-600 mb-4">Bedankt voor je boeking!</h3>
          <p className="text-stone-600">
            Je ontvangt zo snel mogelijk een bevestiging per e-mail.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700">
              Naam *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
              focus:border-stone-500 focus:ring-stone-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
              focus:border-stone-500 focus:ring-stone-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
              Telefoonnummer (optioneel)
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
              focus:border-stone-500 focus:ring-stone-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-stone-700">
                Datum *
              </label>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
                focus:border-stone-500 focus:ring-stone-500"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-stone-700">
                Tijd *
              </label>
              <input
                type="time"
                id="time"
                required
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
                focus:border-stone-500 focus:ring-stone-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-stone-700">
              Opmerkingen (optioneel)
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm 
              focus:border-stone-500 focus:ring-stone-500"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-stone-800 hover:bg-stone-700'
            }`}
          >
            {isSubmitting ? 'Bezig met verzenden...' : 'Boek afspraak'}
          </motion.button>
        </form>
      )}
    </motion.div>
  )
} 