uniform float time;
uniform bool grayscale;
uniform float nIntensity;
uniform float sIntensity;
uniform float sCount;
uniform sampler2D tDiffuse;
varying vec2 vTextureCoord;

float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec4 cTextureScreen = texture2D( tDiffuse, vTextureCoord );
  float dx = rand( vTextureCoord + time );
  vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );
  vec2 sc = vec2( sin( vTextureCoord.y * sCount ), cos( vTextureCoord.y * sCount ) );

  cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;
  cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );

  if( grayscale ) {
    cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );
  }

  gl_FragColor =  vec4( cResult, cTextureScreen.a );
}
