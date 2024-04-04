'use client'
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const isActive: (pathname: string) => boolean = (pathname) => Boolean(pathname);

  const { data: session = {user: {name: '', email: ''}}, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/">
          Feed
      </Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/">

            Feed
          
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          Log in
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/">

            Feed
          
        </Link>
        <Link href="/drafts">
          My drafts
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session?.user?.name} ({session?.user?.email})
        </p>
        <Link href="/create">
          <button>
          New post
          </button>
        </Link>
        <button onClick={() => signOut()}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
    </nav>
  );
};

export default Header;