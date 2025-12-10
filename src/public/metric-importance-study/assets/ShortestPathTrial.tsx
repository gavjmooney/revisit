import { useState, useEffect, useRef } from 'react';
import {
  Radio, Stack, Text, Box,
} from '@mantine/core';
import { StimulusParams } from '../../../store/types';
import { useNextStep } from '../../../store/hooks/useNextStep';

interface TrialParameters {
  imagePath: string;
  options: string[];
}

export default function ShortestPathTrial({
  parameters,
  setAnswer,
}: StimulusParams<TrialParameters>) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shouldAdvance, setShouldAdvance] = useState(false);
  const { goToNextStep } = useNextStep();
  const answerSet = useRef(false);

  const handleSelection = (value: string) => {
    if (answerSet.current) return;
    answerSet.current = true;

    setSelected(value);

    setAnswer({
      status: true,
      answers: {
        shortestPath: value,
      },
    });

    setShouldAdvance(true);
  };

  useEffect(() => {
    if (shouldAdvance && selected) {
      const timer = setTimeout(() => {
        goToNextStep();
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shouldAdvance, selected, goToNextStep]);

  const imageUrl = `${import.meta.env.BASE_URL}${parameters.imagePath}`;

  return (
    <Stack align="center" gap="md">
      <Text fw={500}>
        Select the length of the shortest path between the two nodes highlighted in red.
      </Text>

      <Box style={{ width: '33%' }}>
        <img
          src={imageUrl}
          alt="Graph visualization"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Stack align="flex-start" gap="xs">
        <Text fw={500}>Shortest path length:</Text>

        <Radio.Group value={selected} onChange={handleSelection}>
          <Stack gap="xs">
            {parameters.options.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </Stack>
        </Radio.Group>
      </Stack>
    </Stack>
  );
}
