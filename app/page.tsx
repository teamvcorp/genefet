'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {

  WrenchScrewdriverIcon,
  SparklesIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    name: 'Full Detailing',
    description: 'Interior/Exterior, wash, wax, shampoo, and odor treatment.',
    icon: SparklesIcon,
  },
  {
    name: 'Rust Repair',
    description: 'Cut-out and patch, surface prep, and corrosion protection.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Paint & Refinish',
    description: 'Panel respray, blend, and clear-coat correction.',
    icon: PaintBrushIcon,
  },
  {
    name: 'Trim & Minor Body',
    description: 'Bumpers, mirrors, moldings, dings, and small dents.',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Insurance Friendly',
    description: 'We’ll coordinate estimates and documentation.',
    icon: TruckIcon,
  },
  {
    name: 'Free Estimates',
    description: 'Straightforward quotes before any work begins.',
    icon: CurrencyDollarIcon,
  },
]

export default function AboutGenefet() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-900">
  

      {/* HERO */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* bg blob top */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl py-28 sm:py-40 lg:py-48">
          <div className="text-center">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-white">
              Genefet Body Shop &amp; Auto Dealer
            </h1>
            <p className="mt-6 text-pretty text-lg font-medium text-gray-600 sm:text-xl/8 dark:text-gray-300">
              Trusted local shop for <strong>detailing</strong>, <strong>rust repair</strong>, <strong>paint</strong>,
              and <strong>trim</strong>. Visit us at <strong>429 Irving St, Storm Lake, IA</strong> or call for your{' '}
              <strong>FREE ESTIMATE</strong>.
            </p>
            <div className="mt-8">
              <Image
              src="/images/genefet-hero.jpg"
              alt="Genefet Body Shop & Auto Dealer exterior / shop photo"
              width={1200}
              height={600}
              className="w-full rounded-2xl shadow-lg ring-1 ring-black/10 dark:ring-white/10"
              priority
              />
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="tel:+17127303636"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
              >
                Call (712) 730-3636
              </Link>
              <Link
                href="https://www.google.com/maps/search/?api=1&query=429+Irving+St+Storm+Lake+IA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm/6 font-semibold text-gray-900 dark:text-white"
              >
                Get directions →
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              Mon–Fri: Call for availability • Sat–Sun: By appointment
            </p>
          </div>
        </div>

        {/* bg blob bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Our Services</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Quality work, honest pricing, and fast turnarounds—backed by local experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center rounded-xl p-3 ring-1 ring-gray-200 dark:ring-white/10">
                  <s.icon className="size-6 text-gray-900 dark:text-white" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.name}</h3>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="tel:+17127303636"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            Call for a Free Estimate
          </Link>
          <Link
            href="https://www.google.com/maps/search/?api=1&query=429+Irving+St+Storm+Lake+IA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white"
          >
            Find us at 429 Irving St, Storm Lake, IA
          </Link>
        </div>
      </section>
    </div>
  )
}
