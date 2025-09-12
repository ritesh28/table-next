import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { navbarLinks } from '@/model/navbar-links';
import { Grip } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import LogoImageSmall from '../../public/logo_white_small.png';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function Navbar() {
  const { setTheme, theme, systemTheme } = useTheme();

  return (
    <header className='flex items-center px-2 bg-navbar text-navbar-foreground h-full'>
      <Link href='/'>
        <div className='flex gap-3'>
          <div className='h-auto basis-[2.25rem]'>
            <Image src={LogoImageSmall} alt='logo' priority />
          </div>
          <h2 className='self-center scroll-m-20 text-xl sm:text-4xl font-extrabold tracking-tight text-balance'>Tanstack table</h2>
        </div>
      </Link>
      <div className='ml-auto'>
        <div className='hidden sm:block'>
          <div className='flex gap-4'></div>
          {navbarLinks.map((link) => (
            <Tooltip key={link.title}>
              <TooltipTrigger asChild>
                <a href={link.url} target='_blank'>
                  <Button size='icon' className='text-navbar-foreground bg-navbar hover:bg-navbar-foreground hover:text-navbar'>
                    <link.icon />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <ModeToggle buttonClassName='text-navbar-foreground bg-navbar hover:bg-navbar-foreground hover:text-navbar' />
        </div>
        <div className='block sm:hidden'>
          <Sheet>
            <SheetTrigger>
              <Grip />
            </SheetTrigger>
            <SheetContent className='w-[15rem]'>
              <SheetHeader>
                <SheetTitle className='sr-only'>Links</SheetTitle>
                <SheetDescription className='mt-8' asChild>
                  <ul className='mx-2 [&>li]:mt-2'>
                    {navbarLinks.map((link) => (
                      <li key={link.title}>
                        <Link href={link.url} target='_blank'>
                          <div className='flex gap-2 items-center mb-4'>
                            <link.icon size='1.25rem' strokeWidth='.085rem' />
                            <span className='text-xl tracking-wide font-medium'>{link.title}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <hr className='my-6' />
                    </li>
                    <li>
                      <div className='flex gap-4 items-center'>
                        <Switch
                          id='theme-mode'
                          checked={theme == 'dark' || (theme == 'system' && systemTheme == 'dark')}
                          onCheckedChange={(checked) => (checked ? setTheme('dark') : setTheme('light'))}
                        />
                        <Label htmlFor='theme-mode'>Dark Mode</Label>
                      </div>
                    </li>
                  </ul>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
