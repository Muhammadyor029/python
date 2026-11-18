import React from 'react';
import {BACKEND_ASSETS, BackendCardId} from '../data/backendCards';

interface CardTopNavProps {
  items: [string, string, string];
  activeIndex?: number;
  pillVariant?: 'light' | 'dark' | 'ink';
}

function CardTopNav({items, activeIndex, pillVariant = 'light'}: CardTopNavProps) {
  const pillClass =
    pillVariant === 'dark'
      ? 'k-pill k-pill-dark'
      : pillVariant === 'ink'
        ? 'k-pill k-pill-ink'
        : 'k-pill';

  return (
    <div className="k-nav">
      <div className="k-logo">
        <svg viewBox="0 0 54 42" fill="none" aria-hidden="true">
          <path
            d="M17 10L6 21L17 32M37 10L48 21L37 32M30 6L24 36"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Paimon</span>
      </div>
      <div className="k-menu">
        {items.map((item, idx) => (
          <span key={item} className={idx === activeIndex ? pillClass : undefined}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BackendCardBodyProps {
  id: BackendCardId;
}

export function BackendCardBody({id}: BackendCardBodyProps) {
  switch (id) {
    case 'python':
      return (
        <>
          <div
            className="card-home-bg"
            style={{backgroundImage: `url("${BACKEND_ASSETS.terminal}")`}}
          />
          <div className="card-home-veil" />
          <CardTopNav
            items={['PYTHON', 'ASOSLAR', 'OOP']}
            activeIndex={0}
          />
          <div className="card-home-stats">
            <div className="card-home-stat">
              <div className="card-home-num">0 dan</div>
              <div className="card-home-lbl">print(&quot;Salom&quot;)</div>
            </div>
            <div className="card-home-stat">
              <div className="card-home-num">3.12</div>
              <div className="card-home-lbl">Python versiyasi</div>
            </div>
          </div>
          <div className="card-home-tag">
            O‘zgaruvchilar, sikllar, funksiyalar va toza backend mantiqi.
          </div>
        </>
      );

    case 'postgres':
      return (
        <>
          <CardTopNav
            items={['JADVALLAR', 'POSTGRESQL', 'ORM']}
            activeIndex={1}
            pillVariant="dark"
          />
          <div className="card-price-num">
            <span className="card-price-dollar">SQL</span>O(log N)
          </div>
          <div className="card-price-sub">INDEKS · JOIN · MIGRATSIYA</div>
          <div className="card-price-plans">
            <div className="card-price-row">
              <span>Primary Key</span>
              <span>Unikal ID</span>
            </div>
            <div className="card-price-row">
              <span>Foreign Key</span>
              <span>Bog‘lanish</span>
            </div>
            <div className="card-price-row">
              <span>select_related</span>
              <span>1 ta so‘rov</span>
            </div>
          </div>
          <div className="card-price-btn">Omborxona misoli</div>
        </>
      );

    case 'django':
      return (
        <>
          <div
            className="card-case-bg"
            style={{backgroundImage: `url("${BACKEND_ASSETS.vault}")`}}
          />
          <div className="card-case-veil" />
          <CardTopNav items={['URLS', 'VIEWS', 'MODELS']} activeIndex={1} />
          <div className="card-case-kicker">MODUL 03 · DJANGO &amp; REST API</div>
          <div className="card-case-title">
            URL marshrutdan JSON javobgacha — ofitsiant va oshxona mantiqi
          </div>
          <div className="card-case-stats">
            <div className="card-case-stat">
              <div className="card-case-num">200 OK</div>
              <div className="card-case-lbl">API javob statusi</div>
            </div>
            <div className="card-case-stat">
              <div className="card-case-num">MVT</div>
              <div className="card-case-lbl">tizim arxitekturasi</div>
            </div>
            <div className="card-case-stat">
              <div className="card-case-num">DRF</div>
              <div className="card-case-lbl">Serializer &amp; ViewSet</div>
            </div>
          </div>
        </>
      );

    case 'auth':
      return (
        <>
          <CardTopNav
            items={['XESHLASH', 'JWT AUTH', 'HIMOYA']}
            activeIndex={1}
          />
          <div className="card-vision-row">
            <div
              className="card-vision-tile"
              style={{backgroundImage: `url("${BACKEND_ASSETS.terminal}")`}}
            />
            <div
              className="card-vision-tile"
              style={{backgroundImage: `url("${BACKEND_ASSETS.vault}")`}}
            />
            <div className="card-vision-quote">
              Xavfsiz backend:{' '}
              <em>parollar bazada hech qachon ochiq holda saqlanmaydi.</em>
            </div>
          </div>
          <div className="card-vision-footer">
            <div>
              Argon2 xeshlash, Access/Refresh JWT
              <br />
              va Rate Limiting himoyasi
            </div>
            <div>Xavfsizlik · 4-modul</div>
          </div>
        </>
      );

    case 'celery':
      return (
        <>
          <div
            className="card-alloy-bg"
            style={{backgroundImage: `url("${BACKEND_ASSETS.pipeline}")`}}
          />
          <div className="card-alloy-veil" />
          <CardTopNav items={['REDIS', 'CELERY', 'BEAT']} activeIndex={1} />
          <div className="card-alloy-title">
            Asinxron navbat
            <em>Celery + Redis.</em>
          </div>
          <div className="card-alloy-specs">
            <div className="card-alloy-row">
              <span>Broker</span>
              <span>Redis 7 RAM</span>
            </div>
            <div className="card-alloy-row">
              <span>Worker</span>
              <span>Fon vazifalari</span>
            </div>
            <div className="card-alloy-row">
              <span>Reja</span>
              <span>Celery Beat ↗</span>
            </div>
          </div>
        </>
      );

    case 'deploy':
      return (
        <>
          <CardTopNav
            items={['DOCKER', 'NGINX', 'DEPLOY']}
            activeIndex={0}
            pillVariant="ink"
          />
          <div className="card-journal-title">
            Production
            <em>Docker, Gunicorn va Nginx</em>
          </div>
          <div className="card-journal-posts">
            <div>
              <div
                className="card-journal-thumb"
                style={{backgroundImage: `url("${BACKEND_ASSETS.deploy}")`}}
              />
              <div className="card-journal-kicker">KONTAYNER</div>
              <div className="card-journal-post-title">
                Docker Compose bilan barcha xizmatlar bir buyruqda
              </div>
            </div>
            <div>
              <div
                className="card-journal-thumb"
                style={{backgroundImage: `url("${BACKEND_ASSETS.pipeline}")`}}
              />
              <div className="card-journal-kicker">PROKSI</div>
              <div className="card-journal-post-title">
                Nginx SSL va Gunicorn
              </div>
            </div>
            <div>
              <div
                className="card-journal-thumb"
                style={{backgroundImage: `url("${BACKEND_ASSETS.vault}")`}}
              />
              <div className="card-journal-kicker">MONITORING</div>
              <div className="card-journal-post-title">
                Loglar va 99.9% barqarorlik
              </div>
            </div>
          </div>
        </>
      );
  }
}
