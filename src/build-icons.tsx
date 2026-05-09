import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import { ModelsDotDevLogo } from './components/models.dev-logo'

const sizes = [16, 32, 64, 128, 192, 256, 512]
const outputDir = path.resolve(process.cwd(), 'public/logo')

const logoSVG = renderToStaticMarkup(
  <ModelsDotDevLogo width="1024" height="1024" />
)

async function main() {
  await mkdir(outputDir, { recursive: true })

  await Promise.all(
    sizes.map(async (size) => {
      await Promise.all([
        sharp(Buffer.from(logoSVG))
          .resize(size, size)
          .rotate(270)
          .png()
          .toFile(path.join(outputDir, `logo-${size}.png`)),

        sharp(Buffer.from(logoSVG))
          .resize(size, size)
          .rotate(270)
          .webp()
          .toFile(path.join(outputDir, `logo-${size}.webp`)),
      ])
    })
  )
}

void main()
