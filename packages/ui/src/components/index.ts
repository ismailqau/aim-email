/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

// Atomic Design - Atoms (Basic building blocks)
export * from './atoms';

// Atomic Design - Molecules (Combinations of atoms)
export * from './molecules';

// Atomic Design - Organisms (Complex UI components)
export * from './organisms';

// Legacy exports for backward compatibility
export { Button } from './atoms/button';
export { Input } from './atoms/input';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
export { Badge } from './atoms/badge';
export { Avatar, AvatarFallback, AvatarImage } from './atoms/avatar';
export { Label } from './atoms/label';
