import type { Metadata } from 'next'
import Image from 'next/image'
import type { EventItem } from '@/types'
import { PortableText } from '@portabletext/react'
import { ContactLink } from '@/components/ContactLink'
import { EventsJsonLd } from '@/components/JsonLd'
import { formatDate, formatTime } from '@/lib/utils/dateTime'
import { addUtmParams } from '@/lib/utils/utm'
import { client } from '@/lib/client'
import { PAST_EVENTS_QUERY, UPCOMING_EVENTS_QUERY } from '@/lib/queries'
import { ImageLightbox } from '@/components/ImageLightbox'
import { portableTextComponents } from '@/lib/portableText'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming webinars, workshops, and past event recordings from PorterGoldberg Residential.',
}

// Revalidate every hour (or on-demand via webhook)
export const revalidate = 86400

async function getEventsData(query:string): Promise<EventItem[]> {
  try {
    const data = await client.fetch<EventItem[]>(query)
    return data
  } catch (error) {
    console.error('Failed to fetch from Sanity:', error)
    return []
  }
}

function EventCard({ event, isPast }: { event: EventItem; isPast: boolean }) {
  return (
    <div className="pg-event-card">
      <div className="pg-event-card-content">
        <div className="flex pg-event-header">
          <div className="pg-event-header-left">
            <div className="pg-event-header-text">
            <div className="pg-event-meta">
              <time className="pg-event-date" dateTime={event.date}>
                {formatDate(event.date)}
              </time>
              <span className="pg-event-time">{formatTime(event.date)}</span>
              {event.location && (
                <span className="pg-event-location">{event.location}</span>
              )}
            </div>

            <h3 className="pg-event-title">{event.title}</h3>

            {event.tags && event.tags.length > 0 && (
              <div className="pg-event-tags">
                {event.tags.map((tag) => (
                  <span key={tag} className="pg-event-tag">{tag}</span>
                ))}
              </div>
            )}
                    <div className="pg-event-desc">
                      <PortableText value={event.description} components={portableTextComponents} />
                    </div>

            {(event.speakerName) && (
              <div className="pg-event-speaker">
                <div className="pg-event-speaker-info">
                  <span className="pg-event-speaker-name">{event.speakerName}</span>
                  {event.speakerTitle && (
                    <span className="pg-event-speaker-title">{event.speakerTitle}</span>
                  )}
                </div>
              </div>
            )}

          </div>

          </div>
          <div className="pg-event-header-right">
            {event.image && (
              <div className="pg-event-image-wrapper">
                <ImageLightbox src={event.image.asset.url} alt={event.title}>
                  <Image
                    src={event.image.asset.url}
                    alt={event.title}
                    fill
                    sizes="300px"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                </ImageLightbox>
              </div>
            )}
          </div>

        </div>


        {event.schedule && event.schedule.length > 0 && (
          <div className="pg-event-schedule">
            <h4 className="pg-event-schedule-title">Schedule</h4>
            {event.schedule.map((session) => (
              <div key={session._key} className="pg-event-session">
                <div className="pg-event-session-time">
                  {session.startTime} – {session.endTime}
                </div>
                <div className="pg-event-session-details">
                  <span className="pg-event-session-speaker">
                    {session.speakerName}
                  </span>
                  {session.speakerOrganization && (
                    <span className="pg-event-session-org">
                      {session.speakerOrganization}
                    </span>
                  )}
                  {session.topics && session.topics.length > 0 && (
                    <ul className="pg-event-session-topics">
                      {session.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pg-event-actions">
          {!isPast && event.registrationUrl && (
            <a
              href={addUtmParams(event.registrationUrl, { campaign: 'event-registration' })}
              target="_blank"
              rel="noreferrer"
              className="pg-event-btn pg-event-btn--primary"
            >
              Register Now
            </a>
          )}
          {isPast && event.replayUrls && event.replayUrls.length > 0 && (
            <div className="pg-event-replay-buttons" style={{ marginRight: '20px'}}>
              {event.replayUrls.map((replay, index) => (
                <a
                  key={replay._key}
                  href={addUtmParams(replay.replaySessionUrl, { campaign: 'event-replay' })}
                  target="_blank"
                  rel="noreferrer"
                  className="pg-event-btn pg-event-btn--replay"
                >
                  {replay.replaySessionPartDefinition || `Watch Recording${event.replayUrls!.length > 1 ? ` - Part ${index + 1}` : ''}`}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function EventsPage() {
  const upcoming = await getEventsData(UPCOMING_EVENTS_QUERY);
  const past = await getEventsData(PAST_EVENTS_QUERY);

  const renderEventList = (events: EventItem[], isPast: boolean) => (
    <div className="pg-events-list">
      {events.map((event) => (
        <EventCard key={event._id} event={event} isPast={isPast} />
      ))}
    </div>
  )


  return (
    <main className="pg-page pg-events-page">
      <EventsJsonLd events={[...upcoming, ...past]} />

      <section className="pg-page-hero">
        <h1>Events</h1>
        <p>Webinars, workshops, and community events to help you navigate Chicago real estate</p>
      </section>

      <section className="pg-events-section">
        <div className="pg-events-inner">
          <h2 className="pg-events-section-title">Upcoming Events</h2>

          {upcoming.length > 0 ? (
            renderEventList(upcoming, false)
          ) : (
            <p className="pg-events-empty">
              No upcoming events right now. Check back soon or{' '}
              <ContactLink message="I'd like to subscribe to your newsletter and get notified about upcoming events" className="pg-events-empty-link">
                subscribe to our newsletter
              </ContactLink>{' '}
              to get notified.
            </p>
          )}
        </div>
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="pg-events-section pg-events-section--past">
          <div className="pg-events-inner">
            <h2 className="pg-events-section-title">Past Events</h2>
            {renderEventList(past, true)}
          </div>
        </section>
      )}
    </main>
  )
}
