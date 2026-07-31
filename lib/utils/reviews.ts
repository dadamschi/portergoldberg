import type { Testimonial, ZillowReview, UnifiedReview } from '@/types'

/**
 * Merges testimonials and Zillow reviews into a unified array
 */
export function mergeReviews(
  testimonials: Testimonial[],
  zillowReviews: ZillowReview[] = []
): UnifiedReview[] {
  const unified: UnifiedReview[] = []

  // Normalize testimonials
  testimonials.forEach((t) => {
    unified.push({
      _id: t._id,
      _type: 'testimonial',
      _createdAt: t._createdAt,
      name: t.clientName,
      title: t.clientTitle,
      date: t.date,
      content: t.quote,
      source: 'cms',
      pinOnHomePage: t.pinOnHomePage,
      order: t.order,
    })
  })

  // Normalize Zillow reviews
  zillowReviews.forEach((r) => {
    unified.push({
      _id: r._id,
      _type: 'zillowReview',
      _createdAt: r._createdAt || new Date().toISOString(),
      name: r.reviewerName,
      title: r.transactionType,
      date: r.reviewDate,
      content: r.reviewText,
      source: 'zillow',
      rating: r.rating,
      sourceUrl: r.zillowProfileUrl,
    })
  })

  // Sort by order (if set), then by creation date
  return unified.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
  })
}
