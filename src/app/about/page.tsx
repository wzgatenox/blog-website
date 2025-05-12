import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Hi, I&apos;m Maia - a student with a curious mind and a love for dreams.
        </p>
        <div className="relative w-64 h-64 mx-auto mb-12 rounded-full overflow-hidden shadow-lg">
          <Image 
            src="/maia1.jpeg"
            alt="Maia profile picture" 
            fill 
            style={{ objectFit: "cover" }}
            priority 
          />
        </div>
        {/* You can add more content about yourself here */}
        <p className="text-muted-foreground">
          This blog is a space where I explore the fascinating world of dreams, 
          blending insights from psychology, neuroscience, and personal reflection. 
          Join me as I delve into the mysteries of the sleeping mind!
        </p>
      </div>
    </div>
  )
}