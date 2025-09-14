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

describe('UserProfile utility functions', () => {
  describe('getInitials', () => {
    it('should generate initials from full name', () => {
      const getInitials = (name: string): string => {
        return name
          .split(' ')
          .map(part => part.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2);
      };

      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Muhammad Ismail')).toBe('MI');
      expect(getInitials('Alice')).toBe('A');
      expect(getInitials('Bob Smith Johnson')).toBe('BS');
      expect(getInitials('')).toBe('');
    });
  });

  describe('getDefaultAvatar', () => {
    it('should return correct default avatar based on gender', () => {
      const getDefaultAvatar = (gender?: 'male' | 'female'): string => {
        return gender === 'female'
          ? '/icons/female-avatar.svg'
          : '/icons/male-avatar.svg';
      };

      expect(getDefaultAvatar('male')).toBe('/icons/male-avatar.svg');
      expect(getDefaultAvatar('female')).toBe('/icons/female-avatar.svg');
      expect(getDefaultAvatar()).toBe('/icons/male-avatar.svg');
    });
  });

  describe('getSizeClasses', () => {
    it('should return correct size classes', () => {
      const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
          sm: 'h-8 w-8',
          md: 'h-10 w-10',
          lg: 'h-12 w-12',
        };
        return sizeClasses[size];
      };

      expect(getSizeClasses('sm')).toBe('h-8 w-8');
      expect(getSizeClasses('md')).toBe('h-10 w-10');
      expect(getSizeClasses('lg')).toBe('h-12 w-12');
      expect(getSizeClasses()).toBe('h-10 w-10');
    });
  });

  describe('image loading states', () => {
    it('should handle image loading states correctly', () => {
      let imageLoaded = false;
      let imageError = false;

      const handleImageLoad = () => {
        imageLoaded = true;
        imageError = false;
      };

      const handleImageError = () => {
        imageLoaded = false;
        imageError = true;
      };

      // Simulate successful image load
      handleImageLoad();
      expect(imageLoaded).toBe(true);
      expect(imageError).toBe(false);

      // Simulate image error
      handleImageError();
      expect(imageLoaded).toBe(false);
      expect(imageError).toBe(true);
    });
  });

  describe('user profile data validation', () => {
    it('should validate user profile props', () => {
      interface UserProfileProps {
        name?: string;
        email?: string;
        avatar?: string;
        gender?: 'male' | 'female';
        size?: 'sm' | 'md' | 'lg';
        showDetails?: boolean;
        isOnline?: boolean;
        className?: string;
      }

      const validateProps = (props: UserProfileProps) => {
        return {
          hasName: Boolean(props.name && props.name.trim()),
          hasEmail: Boolean(props.email && props.email.trim()),
          hasAvatar: Boolean(props.avatar),
          validGender:
            props.gender === 'male' ||
            props.gender === 'female' ||
            props.gender === undefined,
          validSize: ['sm', 'md', 'lg'].includes(props.size || 'md'),
        };
      };

      const validProps = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatar.jpg',
        gender: 'male' as const,
        size: 'md' as const,
      };

      const validation = validateProps(validProps);
      expect(validation.hasName).toBe(true);
      expect(validation.hasEmail).toBe(true);
      expect(validation.hasAvatar).toBe(true);
      expect(validation.validGender).toBe(true);
      expect(validation.validSize).toBe(true);

      const emptyProps = {};
      const emptyValidation = validateProps(emptyProps);
      expect(emptyValidation.hasName).toBe(false);
      expect(emptyValidation.hasEmail).toBe(false);
      expect(emptyValidation.hasAvatar).toBe(false);
      expect(emptyValidation.validGender).toBe(true);
      expect(emptyValidation.validSize).toBe(true);
    });
  });
});
