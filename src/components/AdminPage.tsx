import React, { useEffect, useState } from 'react'
import { User } from '../types'
import { apiService, CatalogItem } from '../services/apiService'

interface AdminPageProps {
  user: User
  onBack: () => void
}

type Section =
  | 'dashboard'
  | 'users'
  | 'listings'
  | 'disputes'
  | 'reports'
  | 'catalog'
  | 'audit'

interface CatalogRow extends CatalogItem {
  kind: 'Category' | 'Brand'
}

export const AdminPage: React.FC<AdminPageProps> = ({
  user,
  onBack,
}) => {
  const [section, setSection] = useState<Section>('dashboard')
  const [data, setData] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [catalogKind, setCatalogKind] = useState<'category' | 'brand'>(
    'category'
  )
  const [catalogName, setCatalogName] = useState('')

  const load = async (target: Section = section) => {
    setLoading(true)
    setError('')

    try {
      if (target === 'dashboard') {
        setDashboard(await apiService.getAdminDashboard())
      }

      if (target === 'users') {
        setData(await apiService.getAdminUsers({ limit: 100 }))
      }

      if (target === 'listings') {
        setData(await apiService.getAdminListings({ limit: 100 }))
      }

      if (target === 'disputes') {
        setData(await apiService.getAdminDisputes({ limit: 100 }))
      }

      if (target === 'reports') {
        setData(await apiService.getAdminReports({ limit: 100 }))
      }

      if (target === 'audit') {
        setData(await apiService.getAdminAuditLogs({ limit: 100 }))
      }

      if (target === 'catalog') {
        const [categories, brands] = await Promise.all([
          apiService.getCategories({ limit: 200 }),
          apiService.getBrands({ limit: 200 }),
        ])

        const categoryRows: CatalogRow[] = categories.map(
          (item: CatalogItem) => ({
            ...item,
            kind: 'Category',
          })
        )

        const brandRows: CatalogRow[] = brands.map(
          (item: CatalogItem) => ({
            ...item,
            kind: 'Brand',
          })
        )

        setData([...categoryRows, ...brandRows])
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load admin data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load('dashboard')
  }, [])

  useEffect(() => {
    if (section !== 'dashboard') {
      void load(section)
    }
  }, [section])

  if (user.role !== 'admin') {
    return (
      <div
        className="card-clean"
        style={{
          maxWidth: 560,
          margin: '60px auto',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <h2>Admin access required</h2>

        <p
          style={{
            color: 'var(--muted)',
            margin: '10px 0 20px',
          }}
        >
          This area is restricted to administrator accounts.
        </p>

        <button
          className="btn-primary"
          onClick={onBack}
        >
          Back to ReWear
        </button>
      </div>
    )
  }

  const action = async (fn: () => Promise<unknown>) => {
    try {
      await fn()
      await load(section)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Action failed.'
      )
    }
  }

  const slug = catalogName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const sections: Section[] = [
    'dashboard',
    'users',
    'listings',
    'disputes',
    'reports',
    'catalog',
    'audit',
  ]

  return (
    <div
      style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '28px 16px 80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <div>
          <div className="badge-lime">
            ADMIN CONSOLE
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            ReWear Operations
          </h1>

          <p style={{ color: 'var(--muted)' }}>
            Moderate the marketplace, disputes, reports, and catalog.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={onBack}
        >
          Back to Marketplace
        </button>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          borderBottom: '1px solid var(--line)',
          marginBottom: 24,
        }}
      >
        {sections.map((item: Section) => (
          <button
            key={item}
            onClick={() => setSection(item)}
            style={{
              padding: '10px 14px',
              whiteSpace: 'nowrap',
              fontWeight: section === item ? 800 : 600,
              color:
                section === item
                  ? 'var(--ink)'
                  : 'var(--muted)',
              borderBottom: `3px solid ${
                section === item
                  ? 'var(--ink)'
                  : 'transparent'
              }`,
            }}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            background: '#FDF0F0',
            color: 'var(--rose)',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          className="card-clean"
          style={{
            padding: 24,
            marginBottom: 16,
          }}
        >
          Loading admin data...
        </div>
      )}

      {/* Dashboard */}
      {section === 'dashboard' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(190px,1fr))',
            gap: 16,
          }}
        >
          {[
            {
              label: 'Users',
              value: dashboard?.users,
            },
            {
              label: 'Active Listings',
              value: dashboard?.active_listings,
            },
            {
              label: 'Open Disputes',
              value: dashboard?.open_disputes,
            },
            {
              label: 'Open Reports',
              value: dashboard?.open_reports,
            },
          ].map((item) => (
            <div
              className="card-clean"
              key={item.label}
              style={{ padding: 24 }}
            >
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  marginTop: 8,
                }}
              >
                {item.value ?? '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Catalog */}
      {section === 'catalog' && (
        <div
          className="card-clean"
          style={{ padding: 24 }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            Catalog management
          </h2>

          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 18,
            }}
          >
            <select
              value={catalogKind}
              onChange={(e) =>
                setCatalogKind(
                  e.target.value as 'category' | 'brand'
                )
              }
            >
              <option value="category">
                Category
              </option>

              <option value="brand">
                Brand
              </option>
            </select>

            <input
              value={catalogName}
              onChange={(e) =>
                setCatalogName(e.target.value)
              }
              placeholder="New catalog name"
              style={{
                flex: 1,
                minWidth: 180,
              }}
            />

            <button
              className="btn-primary"
              disabled={!slug}
              onClick={() =>
                action(() =>
                  catalogKind === 'category'
                    ? apiService.createAdminCategory({
                        name: catalogName,
                        slug,
                      })
                    : apiService.createAdminBrand({
                        name: catalogName,
                        slug,
                      })
                )
              }
            >
              Create
            </button>
          </div>

          <Rows
            rows={data}
            actions={(row) => (
              <button
                className="btn-secondary"
                onClick={() =>
                  action(() =>
                    catalogKind === 'category'
                      ? apiService.deleteAdminCategory(
                          row.id
                        )
                      : apiService.deleteAdminBrand(
                          row.id
                        )
                  )
                }
              >
                Delete
              </button>
            )}
          />
        </div>
      )}

      {/* Other sections */}
      {section !== 'dashboard' &&
        section !== 'catalog' && (
          <div
            className="card-clean"
            style={{ padding: 20 }}
          >
            <Rows
              rows={data}
              actions={(row) => (
                <>
                  {/* Users */}
                  {section === 'users' && (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        action(() =>
                          apiService.updateAdminUser(
                            row.id,
                            {
                              is_active:
                                !row.is_active,
                            }
                          )
                        )
                      }
                    >
                      {row.is_active
                        ? 'Disable'
                        : 'Enable'}
                    </button>
                  )}

                  {/* Listings */}
                  {section === 'listings' && (
                    <>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          action(() =>
                            apiService.moderateAdminListing(
                              row.id,
                              {
                                status: 'active',
                              }
                            )
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() =>
                          action(() =>
                            apiService.moderateAdminListing(
                              row.id,
                              {
                                status: 'cancelled',
                              }
                            )
                          )
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Disputes */}
                  {section === 'disputes' && (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        action(() =>
                          apiService.updateAdminDispute(
                            row.id,
                            {
                              status: 'resolved',
                              resolution:
                                'Reviewed by ReWear Trust & Safety',
                            }
                          )
                        )
                      }
                    >
                      Resolve
                    </button>
                  )}

                  {/* Reports */}
                  {section === 'reports' && (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        action(() =>
                          apiService.updateAdminReport(
                            row.id,
                            {
                              status: 'resolved',
                              resolution:
                                'Reviewed by ReWear administration',
                            }
                          )
                        )
                      }
                    >
                      Resolve
                    </button>
                  )}
                </>
              )}
            />
          </div>
        )}
    </div>
  )
}

/* =========================================================
   Reusable Rows Component
   ========================================================= */

const Rows: React.FC<{
  rows: any[]
  actions?: (row: any) => React.ReactNode
}> = ({ rows, actions }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    {rows.length === 0 ? (
      <div
        style={{
          color: 'var(--muted)',
          padding: 24,
          textAlign: 'center',
        }}
      >
        No records found.
      </div>
    ) : (
      rows.map((row: any) => (
        <div
          key={row.id || row.created_at}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: 14,
          }}
        >
          <div>
            <strong>
              {row.title ||
                row.name ||
                row.username ||
                row.reason ||
                row.action ||
                row.id}
            </strong>

            <div
              style={{
                color: 'var(--muted)',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {row.status ||
                row.email ||
                row.message ||
                row.kind ||
                ''}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
            }}
          >
            {actions?.(row)}
          </div>
        </div>
      ))
    )}
  </div>
)
