'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Star, Shield, ArrowRight } from 'lucide-react';
import { API_URL } from '@/lib/api';
import type { Category, Service } from '@/types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/services/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);

    fetch(`${API_URL}/services`)
      .then(res => res.json())
      .then(data => setServices(data.slice(0, 4)))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
                #1 Home Services Platform
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                Expert Services<br />At Your Doorstep
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                From home cleaning to electrical repairs — book trusted professionals in minutes. Quality service, guaranteed satisfaction.
              </p>
              <div className="flex gap-4">
                <Link href="/services">
                  <Button className="bg-black text-white hover:bg-black/90 rounded-sm px-6 py-6 font-bold">
                    Book a Service <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/provider/onboarding">
                  <Button variant="outline" className="border-2 border-black rounded-sm px-6 py-6 font-bold hover:bg-gray-50">
                    Become a Provider
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 border-2 border-black p-6 space-y-4">
              {[
                { icon: CheckCircle, text: 'Verified Professionals' },
                { icon: Clock, text: 'Same Day Service' },
                { icon: Star, text: '4.8+ Average Rating' },
                { icon: Shield, text: 'Satisfaction Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white border border-gray-200 p-4">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '2000+', label: 'Service Providers' },
              { value: '100+', label: 'Services Offered' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl lg:text-4xl font-black text-yellow-400">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black">Browse by Category</h2>
              <p className="text-gray-500">Find the service you need</p>
            </div>
            <Link href="/services" className="text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services?categoryId=${cat.id}`}
                className="border-2 border-black p-6 text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-bold text-sm">{cat.name}</div>
                <div className="text-xs text-gray-500">View services →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black">Popular Services</h2>
              <p className="text-gray-500">Most booked services by our customers</p>
            </div>
            <Link href="/services" className="text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white border-2 border-black p-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="h-32 bg-gray-100 flex items-center justify-center border-b-2 border-black">
                  <span className="text-4xl font-black text-gray-300">{service.name[0]}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{service.name}</h3>
                    <span className="bg-black text-white text-xs px-1.5 py-0.5">★ 4.8</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">₹{service.price}</span>
                      <span className="text-xs text-gray-500"> onwards</span>
                    </div>
                    <span className="text-xs text-gray-400">⏱ {service.duration}h</span>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-500">203 reviews</span>
                    <Link href={`/services/${service.id}`} className="text-sm font-bold hover:underline">
                      Book Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Choose a Service', desc: 'Browse through our wide range of professional services' },
              { step: '02', title: 'Book & Schedule', desc: 'Select your preferred date, time and enter your address' },
              { step: '03', title: 'Get It Done', desc: 'Our verified professional arrives and completes the service' },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-16 h-16 border-2 border-black mx-auto flex items-center justify-center font-black text-xl mb-4 bg-yellow-100">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of satisfied customers who trust us for their home service needs.
          </p>
          <Link href="/services">
            <Button className="bg-white text-black hover:bg-gray-100 rounded-sm px-8 py-6 font-bold">
              Book Your First Service <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
