import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { useBlogBySlug } from '@/hooks/useBlogs';
import { resolveImageUrl } from '@/lib/imageUtils';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-background">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl animate-pulse space-y-6">
            <div className="h-8 bg-secondary w-2/3" />
            <div className="h-4 bg-secondary w-1/4" />
            <div className="aspect-[16/9] bg-secondary" />
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-background min-h-[60vh]">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
            <h1 className="font-serif text-3xl mb-4">Blog not found</h1>
            <Link to="/blogs" className="btn-luxury-primary">Back to Blogs</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const paragraphs = (blog.content || '').split(/\n\n+/).filter(Boolean);

  return (
    <Layout>
      <article className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <p className="text-xs tracking-luxury uppercase text-muted-foreground mb-2">
            {format(new Date(blog.published_at), 'dd MMM yyyy')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{blog.title}</h1>

          <div className="aspect-[16/9] overflow-hidden bg-secondary mb-8 border border-border">
            <img src={resolveImageUrl(blog.image_url)} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
          </div>

          {blog.excerpt && <p className="text-lg text-muted-foreground mb-8">{blog.excerpt}</p>}

          <div className="space-y-5 text-foreground/90 leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{blog.content}</p>
            )}
          </div>

          {blog.source_url && (
            <a
              href={blog.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-10 text-primary hover:underline"
            >
              Read original source
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetail;
