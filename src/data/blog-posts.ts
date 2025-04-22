export interface BlogPost {
  title: string
  content: string
  date: string
  author: string
  subtitle?: string
  worksCited?: string[]
  imageUrl?: string
}

export const blogPosts: Record<string, BlogPost> = {
  "what-if-your-dreams-are-lying": {
    title: "What If Your Dreams Are Lying to You?",
    subtitle: "Exploring the complex relationship between dreams, meaning, and neuroscience",
    imageUrl: "/purple-brain.jpeg",
    content: `You wake up breathless and your heart is pounding. It felt like a vivid, emotional, as well as a strangely meaningful memory more so than just a dream. Perhaps it was trying to tell you something about yourself… But what if it wasn't?

If you've ever found yourself lying awake, replaying thoughts you can't explain, you're not alone. We all dream and sometimes those dreams feel like they matter. Dreams have been seen as symbolic for many centuries. Ancient Egyptians believed they were messages from the gods. Some Indigenous North American traditions treat dreams as spiritual guides (Barrett 8). Freud built on this tradition. He argued that dreams reveal certain hidden fears, desires, and memories.

However, with neuroscience evolving many grew skeptical of Freud's theory and new explanations were introduced. This disagreement raised a question we still ask even today: Are our dreams trying to tell us something or are they just the brain making things up?

There's still no clear answer. Theories contradict one another, offering vastly different takes on where dreams come from and what (if anything) they mean. But looking at these views isn't just about dreams. It's about how we make sense of the chaos inside our minds.

To make sense of all this, we'll look at three perspectives: Freud's theory of wish fulfillment, Hobson and McCarley's brain-based model, and Windt's idea of dreams as fictional remembering. They offer very different answers. Still one thing they share is that meaning comes not from the dream alone, but from how we choose to see it.

## Freud would say your dreams mean everything

Freud believed that every dream had two layers. The remembered part was called the manifest content—the surface-level story we recall in the morning. Beneath that was the latent content—the deeper, hidden meaning connected to our unconscious thoughts. According to him, dream analysis helps us move from the surface to what the dream is really expressing. Even today, some therapists still use dream interpretation to explore feelings people haven't yet processed consciously.

This belief shaped Freud's entire theory of dreams. In The Interpretation of Dreams, he argued that dreams are a form of wish fulfillment. Even when they seem random or strange, Freud believed they were expressing unconscious desires (Freud 1900). A child who is denied something during the day might dream about getting it at night. According to Freud, that's not a coincidence—it's the mind trying to satisfy the wish in another way.

## Science says… your dreams might just be random sparks

What Freud saw as deeply symbolic, neuroscientists Allan Hobson and Robert McCarley saw as something far simpler—and far more random. In 1977, they introduced the activation-synthesis model, a theory that challenged the very idea of hidden meanings in dreams. According to their research, dreams happen when the brainstem sends random signals during REM sleep, and the brain—wired to connect dots—tries to shape the noise into something that feels like a story. (Hobson and McCarley 1977).

In this view, dreams aren't messages at all. They're not reflections of your secret fears or repressed desires, but flickers of mental static that just happen to form a scene. It's more like mental noise—random bursts of brain activity that the mind rushes to organize into something recognizable. It's kind of like when we see shapes in clouds or hear our name in a crowd that never said it. The brain fills in blanks—it always has.

## Meet the middle ground: dreams as fictional remembering

That's where Jennifer Windt comes in. A cognitive scientist, Windt offers a theory that sits between Freud and Hobson. She sees dreams not as hidden messages or pure randomness—but as something else entirely: fictional memories. In her view, dreams are stories our minds build while we sleep, blending imagination with bits of real experience (Windt 2015).

Windt's idea helps explain why dreams feel meaningful, even when they're not about anything real. Her research suggests that dreams can have emotional weight, but that doesn't always mean they're revealing deep truths. They're more like the brain's storytelling machine working overnight.

## So, what do dreams really tell us?

In the end, it seems that dreams aren't fully true—or completely false. They're shaped by both the brain and the mind—and what they reveal depends more on us than on the dream itself.

Dreams are strange, emotional, and sometimes meaningful—but not always. Some come from the subconscious, some from brain activity, and others are simply stories we tell ourselves in the dark. What we do know is that dreams are shaped by both biology and psychology—and they reveal how deeply we're wired to search for meaning, even when things don't make sense.

Maybe that's why dreams matter—not because they always hold answers, but because they invite us to keep asking questions we might not ask when we're awake.

So the next time you wake up from a dream, wondering what it meant—maybe the question isn't what it meant at all. Maybe the real question is: what did it awaken in you?`,
    date: "2024-03-20",
    author: "Maia Zatorska",
    worksCited: [
      "Edwards, Caroline, et al. 'Dreams, Reflection, and Self-Insight.' Journal of Humanistic Psychology, vol. 53, no. 4, 2013, pp. 347–362.",
      "Freud, Sigmund. The Interpretation of Dreams. Macmillan, 1900.",
      "Hobson, J. Allan, and Robert W. McCarley. 'The Brain as a Dream-State Generator: An Activation-Synthesis Hypothesis of the Dream Process.' American Journal of Psychiatry, vol. 134, no. 12, 1977, pp. 1335–1348.",
      "Siclari, Francesca, et al. 'The neural dynamics of dreaming.' Nature Neuroscience, vol. 25, 2022, pp. 106–114.",
      "Windt, Jennifer M. Dreaming: A Conceptual Framework for Philosophy of Mind and Empirical Research. MIT Press, 2015.",
      "Barrett, Deirdre. The Committee of Sleep: How Artists, Scientists, and Athletes Use Dreams for Creative Problem Solving—and How You Can Too. Oneiroi Press, 2001."
    ]
  }
} 