/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetPair } from '../types';
import cupImg from '../assets/images/cup_drinks_blend_1793060145485.jpg';
import vaseImg from '../assets/images/flower_vase_blend_1793060145956.jpg';
import dayCityImg from '../assets/images/city_daytime_blend_1793060146199.jpg';
import nightCityImg from '../assets/images/city_nighttime_blend_1793060147493.jpg';

export const PRESET_PAIRS: PresetPair[] = [
  {
    id: 'textbook-cups-vase',
    title: '교과서 93쪽: 음료수 컵과 꽃병',
    subtitle: '교과서 본문에 수록된 대표적인 오버랩 변환 예제',
    img1Url: cupImg,
    img1Name: '이미지 1: 음료수가 담긴 2개의 컵',
    img2Url: vaseImg,
    img2Name: '이미지 2: 꽃병 사진',
    description: '교과서 93쪽: k가 0에서 1로 변함에 따라 음료수 컵 사진 위로 꽃병 사진이 서서히 겹치며 전환됩니다.',
  },
  {
    id: 'city-day-night',
    title: '도심 스카이라인의 낮과 밤',
    subtitle: '조명과 시간의 흐름을 나타내는 디졸브 합성',
    img1Url: dayCityImg,
    img1Name: '이미지 1: 푸른 하늘의 낮 도심',
    img2Url: nightCityImg,
    img2Name: '이미지 2: 화려한 불빛의 밤 도심',
    description: '빛의 행렬 데이터가 결합되어 일몰에서 야경으로 자연스럽게 전환되는 효과를 관찰해보세요.',
  },
];
