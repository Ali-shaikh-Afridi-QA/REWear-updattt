export type View =
  | 'landing'
  | 'home'
  | 'browse'
  | 'sell'
  | 'donate'
  | 'wallet'
  | 'orders'
  | 'profile'
  | 'favorites'
  | 'login'

export type AuthMode = 'login' | 'register'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  location: string
  memberSince: string
  rating: number
  ratingCount: number
  successfulExchanges: number
  donationsCompleted: number
  itemsListed: number
  pointsBalance: number
  lockedPoints: number
  badges: string[]
}

export interface DefectItem {
  id: string
  label: string
  severity: 'minor' | 'moderate' | 'major'
}

export interface Product {
  id: number
  title: string
  brand: string
  category: string
  size: string
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids'
  condition: 'Brand New with Tags' | 'Like New' | 'Excellent' | 'Good' | 'Well Worn'
  defects: string[]
  points: number
  distance: string
  distanceKm: number
  seller: {
    id: string
    name: string
    avatar: string
    rating: number
    location: string
    exchangesCount: number
    joinedDate: string
  }
  images: string[]
  description: string
  pickupType: 'both' | 'meetup' | 'delivery'
  createdAt: string
  status: 'active' | 'reserved' | 'completed'
}

export interface ValuationQuestionnaire {
  mode: 'sell' | 'donate'
  category: string
  brand: string
  size: string
  age: string
  overallCondition: string
  defects: string[]
  photos: string[]
  estimatedPoints: number
}

export type OrderStage =
  | 'Exchange Requested'
  | 'Points Locked'
  | 'Meetup/Delivery Set'
  | 'Item Received'
  | 'Points Released'
  | 'Completed'

export interface Order {
  id: string
  product: Product
  type: 'meetup' | 'delivery'
  points: number
  counterparty: {
    name: string
    avatar: string
    role: 'buyer' | 'seller'
    rating: number
    phone: string
  }
  status: 'active' | 'completed' | 'cancelled' | 'disputed'
  stage: OrderStage
  stageIndex: number // 0 to 5
  meetupDetails?: {
    locationName: string
    address: string
    date: string
    time: string
    isConfirmed: boolean
  }
  deliveryDetails?: {
    totalFee: number
    buyerShare: number
    sellerShare: number
    trackingNumber: string
    carrier: string
    status: string
  }
  disputeReason?: string
  createdAt: string
}

export interface WalletTransaction {
  id: string
  title: string
  date: string
  points: number
  type: 'earned' | 'spent' | 'locked' | 'refund'
  status: 'Completed' | 'Pending Escrow' | 'Released'
  orderId?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'points' | 'system' | 'chat'
}

export interface FilterOptions {
  query: string
  category: string
  brand: string
  size: string
  condition: string
  maxPoints: number
  maxDistanceKm: number
  sortBy: 'nearest' | 'newest' | 'lowest_points' | 'best_rated'
}
