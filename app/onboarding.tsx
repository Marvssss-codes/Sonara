// @ts-nocheck
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const SLIDES = [
  { id: 1, image:'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2', title:'Listen to the Best', highlight:'Music', subtitle:'Everyday' },
  { id: 2, image:'https://images.unsplash.com/photo-1487215078519-e21cc028cb29', title:'Discover by', highlight:'Age', subtitle:'Recommendations' },
  { id: 3, image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', title:'Control with', highlight:'Parents', subtitle:'Safe listening' },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length && viewableItems[0].index != null) setIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={{ flex:1, backgroundColor:'#0F0F10' }}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(i)=>String(i.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold:60 }}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri:item.image }} style={{ width, height, justifyContent:'flex-end' }} imageStyle={{ opacity:0.5 }}>
            <View style={{ padding:24, paddingBottom:140, backgroundColor:'rgba(0,0,0,0.35)' }}>
              <Text style={{ color:'#8A5CF6', fontWeight:'800', letterSpacing:2, marginBottom:8 }}>SONARA</Text>
              <Text style={{ color:'#ECEDEE', fontSize:30, fontWeight:'900' }}>
                {item.title} <Text style={{ color:'#ff5ea9' }}>{item.highlight}</Text>
              </Text>
              <Text style={{ color:'#A8ACB3', fontSize:18, marginTop:6 }}>{item.subtitle}</Text>
            </View>
          </ImageBackground>
        )}
      />
      {/* dots */}
      <View style={{ position:'absolute', bottom:100, left:0, right:0, flexDirection:'row', justifyContent:'center', gap:8 }}>
        {SLIDES.map((_, i)=>(
          <View key={i} style={{ width: i===index?20:8, height:8, borderRadius:4, backgroundColor: i===index?'#8A5CF6':'#4A4B50' }} />
        ))}
      </View>
      {/* CTA */}
      <TouchableOpacity
        style={{ position:'absolute', bottom:32, left:24, right:24, backgroundColor:'#8A5CF6', borderRadius:24, paddingVertical:16, alignItems:'center' }}
        onPress={()=>{
          if(index===SLIDES.length-1) router.replace('/(auth)/login');
          else listRef.current?.scrollToIndex({ index:index+1, animated:true });
        }}
        activeOpacity={0.85}
      >
        <Text style={{ color:'#fff', fontWeight:'800' }}>{index===SLIDES.length-1 ? "Let's Get Started" : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}
