import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ProjectsListPage = lazy(() => import('@/pages/ProjectsListPage').then(m => ({ default: m.ProjectsListPage })));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const BlogListPage = lazy(() => import('@/pages/BlogListPage').then(m => ({ default: m.BlogListPage })));
const BlogPostDetailPage = lazy(() => import('@/pages/BlogPostDetailPage').then(m => ({ default: m.BlogPostDetailPage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjectsListPage />
            </Suspense>
          }
        />
        <Route
          path="projects/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjectDetailPage />
            </Suspense>
          }
        />
        <Route
          path="blog"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogListPage />
            </Suspense>
          }
        />
        <Route
          path="blog/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPostDetailPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
