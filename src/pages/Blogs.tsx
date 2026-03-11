import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { usePublishedBlogs } from '@/hooks/useBlogs';
import { resolveImageUrl } from '@/lib/imageUtils';

const Blogs = () => {
  const { data: blogs = [], isLoading, error } = usePublishedBlogs();

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">Journal</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover diamond insights, style stories, and fine jewellery knowledge from our editorial desk.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/3] bg-secondary" />
                  <div className="h-4 bg-secondary w-2/3" />
                  <div className="h-4 bg-secondary w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-destructive">Unable to load blogs right now.</p>
          ) : blogs.length === 0 ? (
            <p className="text-center text-muted-foreground">No blogs published yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group border border-border bg-card overflow-hidden"
                >
                  <Link to={`/blogs/${blog.slug}`}>
                    <div className="aspect-[4/3] bg-secondary overflow-hidden">
                      <img
                        src={resolveImageUrl(blog.image_url)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs tracking-luxury uppercase text-muted-foreground mb-2">
                        {format(new Date(blog.published_at), 'dd MMM yyyy')}
                      </p>
                      <h2 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">{blog.title}</h2>
                      {blog.excerpt && <p className="text-muted-foreground text-sm line-clamp-3">{blog.excerpt}</p>}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blogs;
