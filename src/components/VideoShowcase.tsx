import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const VideoShowcase = () => {
  const { data: videos = [] } = useQuery({
    queryKey: ['showcase-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (videos.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Behind the Craft</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">Our <span className="italic">Story</span> in Motion</h2>
        </motion.div>

        <div className={`grid gap-6 ${videos.length === 1 ? 'max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="relative w-full overflow-hidden rounded-lg bg-foreground/5">
                <video
                  src={video.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[70vh] object-contain"
                  poster=""
                />
              </div>
              {video.title && (
                <div className="mt-3 text-center">
                  <h3 className="font-serif text-lg">{video.title}</h3>
                  {video.description && (
                    <p className="text-muted-foreground text-sm mt-1">{video.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
