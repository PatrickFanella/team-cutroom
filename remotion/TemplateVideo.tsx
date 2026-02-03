/**
 * Template-Based Video Component
 * 
 * Renders video based on template configuration.
 * Supports different visual styles, caption animations, and layouts.
 */

import React from 'react'
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from 'remotion'

// ============================================================================
// TYPES
// ============================================================================

export interface TemplateVideoProps {
  // Content
  title: string
  script: {
    hook: string
    sections: Array<{
      heading: string
      content: string
      duration: number
      speaker?: string  // For dialog mode
    }>
    cta: string
  }
  
  // Media
  voiceUrl?: string
  musicUrl?: string
  backgroundUrl?: string  // Video or image URL
  clips?: Array<{
    url: string
    startTime: number
    duration: number
  }>
  
  // Template config (simplified for Remotion)
  template: {
    // Visual style
    visualStyle: 'broll' | 'gameplay' | 'gradient' | 'static'
    backgroundColor?: string
    gradientColors?: [string, string]
    backgroundOpacity?: number
    
    // Caption style
    captionStyle: 'bold' | 'subtle' | 'karaoke' | 'speech-bubble' | 'none'
    captionPosition: 'top' | 'center' | 'bottom'
    captionFont?: string
    captionColor?: string
    captionStroke?: string
    
    // Animation
    captionAnimation: 'none' | 'word-by-word' | 'typewriter' | 'fade'
    transition: 'cut' | 'crossfade' | 'swipe'
    
    // Color grading
    colorGrade?: {
      warmth?: number
      saturation?: number
      vignette?: number
    }
    
    // Branding
    watermarkUrl?: string
    watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    showEndCard?: boolean
    ctaText?: string
    
    // Character dialog mode
    isDialog?: boolean
    characters?: Array<{
      name: string
      spriteUrl: string
      position: 'left' | 'right'
      color: string
    }>
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TemplateVideo: React.FC<TemplateVideoProps> = ({
  title,
  script,
  voiceUrl,
  musicUrl,
  backgroundUrl,
  clips = [],
  template,
}) => {
  const { fps, width, height, durationInFrames } = useVideoConfig()
  const frame = useCurrentFrame()

  // Calculate section timings
  const introDuration = 3 * fps
  const outroDuration = template.showEndCard ? 4 * fps : 2 * fps
  const sectionFrames = script.sections.map(s => s.duration * fps)

  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <BackgroundLayer 
        template={template} 
        backgroundUrl={backgroundUrl}
        clips={clips}
      />

      {/* Vignette / Color Grade Overlay */}
      {template.colorGrade?.vignette && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${template.colorGrade.vignette}) 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content Sequences */}
      {/* Intro */}
      <Sequence durationInFrames={introDuration}>
        <IntroCard title={title} hook={script.hook} template={template} />
      </Sequence>

      {/* Main Content */}
      {(() => {
        let currentFrame = introDuration
        return script.sections.map((section, i) => {
          const from = currentFrame
          const duration = sectionFrames[i]
          currentFrame += duration
          
          return (
            <Sequence key={i} from={from} durationInFrames={duration}>
              {template.isDialog && template.characters ? (
                <DialogSection 
                  section={section}
                  characters={template.characters}
                  template={template}
                />
              ) : (
                <ContentSection section={section} template={template} />
              )}
            </Sequence>
          )
        })
      })()}

      {/* Outro */}
      <Sequence from={durationInFrames - outroDuration}>
        <OutroCard cta={script.cta} template={template} />
      </Sequence>

      {/* Audio Layers */}
      {voiceUrl && <Audio src={voiceUrl} volume={1} />}
      {musicUrl && <Audio src={musicUrl} volume={0.15} />}

      {/* Watermark */}
      {template.watermarkUrl && (
        <Watermark url={template.watermarkUrl} position={template.watermarkPosition || 'top-right'} />
      )}
    </AbsoluteFill>
  )
}

// ============================================================================
// BACKGROUND LAYER
// ============================================================================

const BackgroundLayer: React.FC<{
  template: TemplateVideoProps['template']
  backgroundUrl?: string
  clips: TemplateVideoProps['clips']
}> = ({ template, backgroundUrl, clips = [] }) => {
  const { fps } = useVideoConfig()
  
  // Gradient background
  if (template.visualStyle === 'gradient' && template.gradientColors) {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${template.gradientColors[0]} 0%, ${template.gradientColors[1]} 100%)`,
        }}
      />
    )
  }
  
  // Static color background
  if (template.visualStyle === 'static') {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: template.backgroundColor || '#0a0a0a',
        }}
      />
    )
  }
  
  // Video/gameplay background
  if (template.visualStyle === 'gameplay' && backgroundUrl) {
    return (
      <AbsoluteFill style={{ opacity: template.backgroundOpacity || 1 }}>
        <Video
          src={backgroundUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>
    )
  }
  
  // B-roll clips
  if (template.visualStyle === 'broll' && clips.length > 0) {
    return (
      <AbsoluteFill style={{ opacity: template.backgroundOpacity || 1 }}>
        {clips.map((clip, i) => (
          <Sequence
            key={i}
            from={Math.floor(clip.startTime * fps)}
            durationInFrames={Math.floor(clip.duration * fps)}
          >
            <Img
              src={clip.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Sequence>
        ))}
      </AbsoluteFill>
    )
  }
  
  // Default: dark background
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }} />
  )
}

// ============================================================================
// INTRO CARD
// ============================================================================

const IntroCard: React.FC<{
  title: string
  hook: string
  template: TemplateVideoProps['template']
}> = ({ title, hook, template }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = interpolate(frame, [0, 15], [50, 0], { extrapolateRight: 'clamp' })
  const hookOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })
  const hookScale = spring({ frame: frame - 20, fps, config: { damping: 12 } })

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: template.captionColor || '#fff',
            fontSize: 56,
            fontWeight: 'bold',
            fontFamily: template.captionFont || 'Inter, system-ui, sans-serif',
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            WebkitTextStroke: template.captionStroke ? `2px ${template.captionStroke}` : undefined,
          }}
        >
          {title}
        </h1>
      </div>

      <div
        style={{
          opacity: hookOpacity,
          transform: `scale(${hookScale})`,
          marginTop: 30,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: '#a0a0ff',
            fontSize: 32,
            fontFamily: template.captionFont || 'Inter, system-ui, sans-serif',
            margin: 0,
          }}
        >
          {hook}
        </p>
      </div>
    </AbsoluteFill>
  )
}

// ============================================================================
// CONTENT SECTION
// ============================================================================

const ContentSection: React.FC<{
  section: TemplateVideoProps['script']['sections'][0]
  template: TemplateVideoProps['template']
}> = ({ section, template }) => {
  const frame = useCurrentFrame()
  
  if (template.captionStyle === 'none') {
    return null
  }

  const contentOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  
  const positionStyle = {
    top: template.captionPosition === 'top' ? 60 : undefined,
    bottom: template.captionPosition === 'bottom' ? 120 : undefined,
  }

  // Word-by-word animation
  if (template.captionAnimation === 'word-by-word') {
    const words = section.content.split(' ')
    const wordsPerFrame = words.length / (section.duration * 30 * 0.7) // Show all words in 70% of duration
    
    return (
      <AbsoluteFill
        style={{
          justifyContent: template.captionPosition === 'center' ? 'center' : 'flex-end',
          alignItems: 'center',
          padding: 40,
          ...positionStyle,
        }}
      >
        <CaptionBox template={template}>
          {words.map((word, i) => {
            const showFrame = i / wordsPerFrame
            const opacity = interpolate(
              frame, 
              [showFrame, showFrame + 5], 
              [0, 1], 
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
            const scale = interpolate(
              frame,
              [showFrame, showFrame + 5],
              [1.2, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
            
            return (
              <span
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: 'inline-block',
                  marginRight: 8,
                }}
              >
                {word}
              </span>
            )
          })}
        </CaptionBox>
      </AbsoluteFill>
    )
  }

  // Default: fade in
  return (
    <AbsoluteFill
      style={{
        justifyContent: template.captionPosition === 'center' ? 'center' : 'flex-end',
        alignItems: 'center',
        padding: 40,
        ...positionStyle,
      }}
    >
      <div style={{ opacity: contentOpacity }}>
        {section.heading && (
          <div style={{ marginBottom: 15 }}>
            <span
              style={{
                color: '#7b7bff',
                fontSize: 24,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              {section.heading}
            </span>
          </div>
        )}
        <CaptionBox template={template}>
          {section.content}
        </CaptionBox>
      </div>
    </AbsoluteFill>
  )
}

// ============================================================================
// DIALOG SECTION (Character conversations)
// ============================================================================

const DialogSection: React.FC<{
  section: TemplateVideoProps['script']['sections'][0]
  characters: NonNullable<TemplateVideoProps['template']['characters']>
  template: TemplateVideoProps['template']
}> = ({ section, characters, template }) => {
  const frame = useCurrentFrame()
  const { fps, height } = useVideoConfig()
  
  // Find speaking character
  const speaker = characters.find(c => c.name === section.speaker) || characters[0]
  const speakerIndex = characters.indexOf(speaker)
  
  const bubbleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
  const bubbleScale = spring({ frame, fps, config: { damping: 15, stiffness: 150 } })

  return (
    <AbsoluteFill>
      {/* Characters */}
      {characters.map((char, i) => (
        <div
          key={char.name}
          style={{
            position: 'absolute',
            bottom: 0,
            [char.position]: 20,
            width: '40%',
            height: '50%',
          }}
        >
          <Img
            src={char.spriteUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: char.name !== section.speaker ? 'brightness(0.7)' : undefined,
            }}
          />
        </div>
      ))}

      {/* Speech Bubble */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: speaker.position === 'left' ? 'flex-start' : 'flex-end',
          padding: 40,
          paddingTop: height * 0.15,
        }}
      >
        <div
          style={{
            opacity: bubbleOpacity,
            transform: `scale(${bubbleScale})`,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: '20px 30px',
            maxWidth: '70%',
            position: 'relative',
          }}
        >
          {/* Speaker name */}
          <div
            style={{
              position: 'absolute',
              top: -25,
              left: speaker.position === 'left' ? 20 : undefined,
              right: speaker.position === 'right' ? 20 : undefined,
              backgroundColor: speaker.color,
              padding: '5px 15px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {speaker.name}
          </div>
          
          {/* Content */}
          <p
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 500,
              color: '#000',
              lineHeight: 1.4,
            }}
          >
            {section.content}
          </p>
          
          {/* Bubble tail */}
          <div
            style={{
              position: 'absolute',
              bottom: -15,
              [speaker.position]: 30,
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '20px solid white',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ============================================================================
// OUTRO CARD
// ============================================================================

const OutroCard: React.FC<{
  cta: string
  template: TemplateVideoProps['template']
}> = ({ cta, template }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const scale = spring({ frame, fps, config: { damping: 10 } })

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: template.captionColor || '#fff',
            fontSize: 44,
            fontWeight: 'bold',
            fontFamily: template.captionFont || 'Inter, system-ui, sans-serif',
            margin: 0,
            WebkitTextStroke: template.captionStroke ? `2px ${template.captionStroke}` : undefined,
          }}
        >
          {template.ctaText || cta}
        </p>

        {template.showEndCard && (
          <div
            style={{
              marginTop: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px 60px',
              borderRadius: 50,
              display: 'inline-block',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              Follow @cutroom
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const CaptionBox: React.FC<{
  template: TemplateVideoProps['template']
  children: React.ReactNode
}> = ({ template, children }) => {
  const style: React.CSSProperties = {
    color: template.captionColor || '#fff',
    fontSize: template.captionStyle === 'bold' ? 48 : 38,
    fontWeight: template.captionStyle === 'bold' ? 'bold' : 500,
    fontFamily: template.captionFont || 'Inter, system-ui, sans-serif',
    lineHeight: 1.4,
    textAlign: 'center',
    maxWidth: '90%',
  }

  if (template.captionStroke) {
    style.WebkitTextStroke = `2px ${template.captionStroke}`
    style.textShadow = '0 2px 10px rgba(0,0,0,0.5)'
  }

  if (template.captionStyle === 'subtle') {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '15px 25px',
          borderRadius: 10,
        }}
      >
        <p style={{ ...style, margin: 0 }}>{children}</p>
      </div>
    )
  }

  return <p style={{ ...style, margin: 0 }}>{children}</p>
}

const Watermark: React.FC<{
  url: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}> = ({ url, position }) => {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    [position.includes('top') ? 'top' : 'bottom']: 20,
    [position.includes('left') ? 'left' : 'right']: 20,
    opacity: 0.7,
  }

  return (
    <div style={posStyle}>
      <Img src={url} style={{ height: 40, width: 'auto' }} />
    </div>
  )
}
