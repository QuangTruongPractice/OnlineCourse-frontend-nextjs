import { render, screen } from '@testing-library/react'
import { Button } from '@/src/components/ui/button'
import '@testing-library/jest-dom'

describe('Button', () => {
    it('renders a button with text', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('renders as disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>)
        const button = screen.getByRole('button', { name: /disabled button/i })
        expect(button).toBeDisabled()
    })
})
