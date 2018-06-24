import * as React from 'react';
import styled from 'styled-components';
import { withProps } from '../../util/styled';

/**
 * Show user's icon.
 */
export function Icon({ icon, dead }: { icon: string | null; dead: boolean }) {
  if (icon == null) return null;
  return (
    <IconWrapper>
      <IconImg dead={dead} width={48} height={48} alt="" src={icon} />
      {/* Add a dead mark when dead. */}
      {dead ? (
        <IconImg width={48} height={48} alt="死亡" src="/images/dead.png" />
      ) : null}
    </IconWrapper>
  );
}

const IconWrapper = styled.div`
  position: relative;
  left: 0;
  top: 0;
  float: left;
  display: block;
  width: 48px;
  height: 48px;
`;

const IconImg = withProps<{ dead?: boolean }>()(styled.img)`
  position: absolute;
  left: 0;
  top: 0;
  filter: ${props => (props.dead ? 'grayscale(100%)' : 'none')};
  width: 48px;
  height: 48px;
`;
