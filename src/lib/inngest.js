import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'portfolio-app',
  eventKey: import.meta.env.VITE_INNGEST_EVENT_KEY
});

// Define events
export const sendProjectNotification = inngest.createFunction(
  { id: 'send-project-notification' },
  { event: 'project.created' },
  async ({ event, step }) => {
    // Send email notification
    await step.run('send-email', async () => {
      // Integration with email service
      console.log('Sending notification for:', event.data.projectTitle);
    });

    // Post to social media (optional)
    await step.run('post-social', async () => {
      // Integration with social APIs
    });
  }
);

// Analytics event
export const trackProjectView = inngest.createFunction(
  { id: 'track-project-view' },
  { event: 'project.viewed' },
  async ({ event, step }) => {
    await step.run('update-analytics', async () => {
      // Update view count in Supabase
      await supabase
        .from('project_analytics')
        .insert({
          project_id: event.data.projectId,
          viewer_id: event.data.viewerId,
          timestamp: new Date()
        });
    });
  }
);