import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'auth/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'landing-page',
    renderMode: RenderMode.Client,
  },
  {
    path: ':barbershopSlug/admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: ':barbershopSlug/barber/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: ':barbershopSlug',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
