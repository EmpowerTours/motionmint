'use client';

import Presentation from '@/components/pitch/Presentation';
import CoverSlide from '@/components/pitch/CoverSlide';
import ProblemSlide from '@/components/pitch/ProblemSlide';
import SolutionSlide from '@/components/pitch/SolutionSlide';
import QuoteSlide from '@/components/pitch/QuoteSlide';
import OutroSlide from '@/components/pitch/OutroSlide';

export default function PitchPage() {
  return (
    <Presentation
      slides={[
        <CoverSlide key="cover" />,
        <ProblemSlide key="problem" />,
        <SolutionSlide key="solution" />,
        <QuoteSlide key="quote" />,
        <OutroSlide key="outro" />,
      ]}
    />
  );
}
