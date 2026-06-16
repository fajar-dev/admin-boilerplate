import { useRoute } from 'vue-router'

export interface NavItem {
  label: string
  to: string
  icon: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const useNavigation = () => {
  const route = useRoute()
  const isCollapsed = useState('sidebar-collapsed', () => false)

  const navGroups: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Dashboard',
          to: '/',
          icon: 'i-lucide-layout-dashboard'
        },
        {
          label: 'Contact',
          to: '/contact',
          icon: 'i-lucide-users-round'
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Website Setting',
          to: '/settings/website',
          icon: 'i-lucide-settings'
        },
      ]
    }
  ]

  const isItemActive = (item: NavItem) => {
    if (item.to === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(item.to)
  }

  return {
    isCollapsed,
    navGroups,
    isItemActive
  }
}
