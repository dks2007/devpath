import { Braces, CodeXml, Flag, Footprints, Gem, Star } from 'lucide-react'

const badges = {
  'first-lesson': { icon: Flag, color: 'gold' },
  persistent: { icon: Footprints, color: 'violet' },
  'javascript-master': { icon: Braces, color: 'lime' },
  'python-master': { icon: CodeXml, color: 'blue' },
  legend: { icon: Gem, color: 'rose' },
}

export function AwardBadge({ id }: { id: string }) {
  const { icon: Icon, color } = badges[id as keyof typeof badges] ?? { icon: Star, color: 'violet' }
  return (
    <span className={'award-badge ' + color} aria-hidden="true">
      <span>
        <Icon size={21} strokeWidth={2.1} />
      </span>
    </span>
  )
}
