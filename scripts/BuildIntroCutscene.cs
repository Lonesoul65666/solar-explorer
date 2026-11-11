using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

class BuildIntroCutscene
{
    struct Star
    {
        public float x, y, z;
        public float r, g, b, size;
    }

    struct Nebula
    {
        public float x, y, z, radius;
        public int r, g, b;
        public float alpha;
    }

    struct Galaxy
    {
        public float x, y, z, scale, tilt, rotSpeed, baseAngle;
        public int r, g, b;
    }

    static float SmoothStep(float edge0, float edge1, float x)
    {
        float t = Math.Max(0f, Math.Min(1f, (x - edge0) / Math.Max(0.0001f, edge1 - edge0)));
        return t * t * (3f - 2f * t);
    }

    static void DrawRadialGlow(Graphics g, float cx, float cy, float radius, Color centerCol, Color midCol, float midPos)
    {
        if (radius < 1.5f) return;
        if (cx + radius < -100 || cx - radius > 1380 || cy + radius < -100 || cy - radius > 820) return;
        using (GraphicsPath path = new GraphicsPath())
        {
            path.AddEllipse(cx - radius, cy - radius, radius * 2f, radius * 2f);
            using (PathGradientBrush pgb = new PathGradientBrush(path))
            {
                pgb.CenterPoint = new PointF(cx, cy);
                pgb.CenterColor = centerCol;
                pgb.SurroundColors = new Color[] { Color.FromArgb(0, midCol.R, midCol.G, midCol.B) };
                ColorBlend cb = new ColorBlend(3);
                cb.Colors = new Color[] {
                    Color.FromArgb(0, midCol.R, midCol.G, midCol.B),
                    midCol,
                    centerCol
                };
                cb.Positions = new float[] { 0f, 1f - midPos, 1f };
                pgb.InterpolationColors = cb;
                g.FillPath(pgb, path);
            }
        }
    }

    static void DrawSpiralGalaxy(Graphics g, float cx, float cy, float radius, float tilt, float rot, int cr, int cg, int cb, float alpha)
    {
        if (radius < 4f || alpha <= 0.01f) return;
        if (cx + radius * 1.5f < 0 || cx - radius * 1.5f > 1280 || cy + radius * 1.5f < 0 || cy - radius * 1.5f > 720) return;

        GraphicsState state = g.Save();
        g.TranslateTransform(cx, cy);
        g.RotateTransform(rot * 180f / (float)Math.PI);
        g.ScaleTransform(1f, tilt);

        int aOuter = Math.Max(0, Math.Min(255, (int)(alpha * 95)));
        int aCore = Math.Max(0, Math.Min(255, (int)(alpha * 225)));
        DrawRadialGlow(g, 0, 0, radius, Color.FromArgb(aCore, 255, 240, 200), Color.FromArgb(aOuter, cr, cg, cb), 0.55f);

        // Draw 2 logarithmic spiral arms
        for (int arm = 0; arm < 2; arm++)
        {
            float armOffset = arm * (float)Math.PI;
            PointF prev = new PointF(0, 0);
            for (int s = 1; s <= 28; s++)
            {
                float frac = s / 28f;
                float theta = armOffset + frac * 4.4f;
                float r = frac * radius * 0.92f;
                PointF pt = new PointF((float)Math.Cos(theta) * r, (float)Math.Sin(theta) * r);
                int segA = Math.Max(0, Math.Min(255, (int)(alpha * (1f - frac * 0.78f) * 150)));
                if (segA > 2)
                {
                    using (Pen p = new Pen(Color.FromArgb(segA, Math.Min(255, cr + 35), Math.Min(255, cg + 35), Math.Min(255, cb + 45)), Math.Max(1.2f, (1f - frac * 0.6f) * radius * 0.09f)))
                    {
                        p.StartCap = LineCap.Round;
                        p.EndCap = LineCap.Round;
                        g.DrawLine(p, prev, pt);
                    }
                }
                prev = pt;
            }
        }
        g.Restore(state);
    }

    static int Main(string[] args)
    {
        if (args.Length < 3)
        {
            Console.Error.WriteLine("Usage: BuildIntroCutscene <ffmpeg_exe> <audio_wav> <out_mp4>");
            return 1;
        }
        string ffmpegExe = args[0];
        string audioWav = args[1];
        string outMp4 = args[2];

        const int W = 1280;
        const int H = 720;
        const int FPS = 30;
        const int TOTAL_SECONDS = 42;
        const int TOTAL_FRAMES = FPS * TOTAL_SECONDS;

        Random rng = new Random(421990);

        // 560 3D stars
        Star[] stars = new Star[560];
        for (int i = 0; i < stars.Length; i++)
        {
            int pal = i % 7;
            float sr = 215, sg = 238, sb = 255;
            if (pal == 0) { sr = 140; sg = 210; sb = 255; }
            else if (pal == 1) { sr = 255; sg = 220; sb = 175; }
            else if (pal == 2) { sr = 185; sg = 205; sb = 255; }
            stars[i] = new Star
            {
                x = (float)(rng.NextDouble() * 2.0 - 1.0) * 1800f,
                y = (float)(rng.NextDouble() * 2.0 - 1.0) * 1100f,
                z = (float)rng.NextDouble() * 1400f + 10f,
                r = sr, g = sg, b = sb,
                size = 0.7f + (float)rng.NextDouble() * 1.85f
            };
        }

        // 14 Volumetric deep-space nebulae
        Nebula[] nebulae = new Nebula[14];
        int[,] nebCols = new int[,] {
            { 16, 110, 210 }, { 95, 42, 195 }, { 8, 165, 195 },
            { 185, 55, 125 }, { 24, 80, 175 }, { 65, 130, 225 },
            { 130, 35, 145 }
        };
        for (int i = 0; i < nebulae.Length; i++)
        {
            int ci = i % 7;
            nebulae[i] = new Nebula
            {
                x = (float)(rng.NextDouble() * 2.0 - 1.0) * 950f,
                y = (float)(rng.NextDouble() * 2.0 - 1.0) * 560f,
                z = (i * (1200f / nebulae.Length)) + 80f,
                radius = 280f + (float)rng.NextDouble() * 220f,
                r = nebCols[ci, 0], g = nebCols[ci, 1], b = nebCols[ci, 2],
                alpha = 0.14f + (float)rng.NextDouble() * 0.10f
            };
        }

        // 6 Distant Spiral Galaxies in deep interstellar space (0s - 22s)
        Galaxy[] galaxies = new Galaxy[] {
            new Galaxy { x = -420f, y = -185f, z = 520f,  scale = 115f, tilt = 0.42f, rotSpeed = 0.18f, baseAngle = 0.4f,  r = 110, g = 185, b = 255 },
            new Galaxy { x =  460f, y =  155f, z = 880f,  scale = 130f, tilt = 0.36f, rotSpeed = -0.15f, baseAngle = 1.2f, r = 195, g = 135, b = 255 },
            new Galaxy { x = -290f, y =  210f, z = 1180f, scale = 105f, tilt = 0.50f, rotSpeed = 0.22f, baseAngle = 2.1f,  r = 90,  g = 210, b = 240 },
            new Galaxy { x =  340f, y = -220f, z = 1480f, scale = 125f, tilt = 0.38f, rotSpeed = -0.19f, baseAngle = 0.8f, r = 255, g = 165, b = 120 },
            new Galaxy { x = -490f, y =   45f, z = 1740f, scale = 110f, tilt = 0.44f, rotSpeed = 0.14f, baseAngle = 1.7f,  r = 140, g = 170, b = 255 },
            new Galaxy { x =  260f, y =  195f, z = 2020f, scale = 120f, tilt = 0.35f, rotSpeed = -0.16f, baseAngle = 2.6f, r = 175, g = 220, b = 255 }
        };

        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = ffmpegExe,
            Arguments = string.Format(
                "-y -hide_banner -loglevel error -f rawvideo -pix_fmt bgr24 -s {0}x{1} -r {2} -i - -i \"{3}\" " +
                "-c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \"{4}\"",
                W, H, FPS, audioWav, outMp4),
            UseShellExecute = false,
            RedirectStandardInput = true,
            CreateNoWindow = true
        };

        using (Process proc = Process.Start(psi))
        {
            using (Stream stdin = proc.StandardInput.BaseStream)
            using (Bitmap bmp = new Bitmap(W, H, PixelFormat.Format24bppRgb))
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.CompositingQuality = CompositingQuality.HighSpeed;
                g.InterpolationMode = InterpolationMode.Bilinear;

                byte[] frameBytes = new byte[W * H * 3];
                Rectangle rect = new Rectangle(0, 0, W, H);

                for (int frame = 0; frame < TOTAL_FRAMES; frame++)
                {
                float t = frame / (float)FPS;

                // Warp speed profile across the 3 acts:
                // a) 0s - 15s: High-speed deep interstellar warp (warp = 1.0)
                // b) 15s - 30s: Gradual deceleration in cosmic dark as distant Sun ignites (1.0 -> 0.22)
                // c) 30s - 42s: Gliding past outer edge of solar system into golden solar glare (0.22 -> 0.07)
                float warp;
                if (t < 15f)
                {
                    warp = 0.85f + 0.15f * SmoothStep(0f, 3f, t);
                }
                else if (t < 30f)
                {
                    float p = SmoothStep(15f, 30f, t);
                    warp = 1.0f - p * 0.78f;
                }
                else
                {
                    float p = SmoothStep(30f, 42f, t);
                    warp = 0.22f - p * 0.15f;
                }

                // Subtle camera drift for organic spacecraft feel
                float camX = W * 0.5f + (float)Math.Sin(t * 0.32) * 18f * (1f - SmoothStep(32f, 42f, t) * 0.7f);
                float camY = H * 0.5f + (float)Math.Cos(t * 0.25) * 11f * (1f - SmoothStep(32f, 42f, t) * 0.7f);

                // 1. Deep space void background
                int bgR = (int)(2 + 10 * SmoothStep(28f, 41f, t));
                int bgG = (int)(4 + 8 * SmoothStep(28f, 41f, t));
                int bgB = (int)(12 + 4 * SmoothStep(0f, 20f, t) - 6 * SmoothStep(30f, 42f, t));
                g.Clear(Color.FromArgb(255, Math.Max(0, bgR), Math.Max(0, bgG), Math.Max(0, bgB)));

                // 2. Volumetric dark & glowing nebulae
                float nebStep = 3.2f + warp * 15.5f;
                float nebVis = 1.0f - SmoothStep(33f, 41.5f, t) * 0.65f;
                for (int i = 0; i < nebulae.Length; i++)
                {
                    nebulae[i].z -= nebStep;
                    if (nebulae[i].z <= 45f)
                    {
                        nebulae[i].z += 1200f;
                    }
                    float z = nebulae[i].z;
                    float scale = 540f / z;
                    float nx = camX + nebulae[i].x * scale;
                    float ny = camY + nebulae[i].y * scale;
                    float nr = nebulae[i].radius * scale;
                    float depthFade = SmoothStep(1250f, 850f, z) * SmoothStep(45f, 220f, z);
                    float a = nebulae[i].alpha * depthFade * nebVis;
                    int alphaInt = Math.Max(0, Math.Min(255, (int)(a * 255f)));
                    if (alphaInt > 3)
                    {
                        DrawRadialGlow(
                            g, nx, ny, nr,
                            Color.FromArgb(alphaInt, nebulae[i].r, nebulae[i].g, nebulae[i].b),
                            Color.FromArgb(alphaInt / 2, nebulae[i].r / 2, nebulae[i].g / 2, nebulae[i].b / 2),
                            0.5f
                        );
                    }
                }

                // 3. Distant spiral galaxies (prominent in 0s - 22s deep interstellar warp)
                float galVis = 1.0f - SmoothStep(16f, 25f, t);
                if (galVis > 0.01f)
                {
                    float galStep = 2.5f + warp * 11.5f;
                    for (int i = 0; i < galaxies.Length; i++)
                    {
                        galaxies[i].z -= galStep;
                        if (galaxies[i].z <= 90f) galaxies[i].z += 1950f;
                        float gz = galaxies[i].z;
                        float gScale = 560f / gz;
                        float gx = camX + galaxies[i].x * gScale;
                        float gy = camY + galaxies[i].y * gScale;
                        float gr = galaxies[i].scale * gScale;
                        float gDepth = SmoothStep(2000f, 1300f, gz) * SmoothStep(90f, 280f, gz);
                        DrawSpiralGalaxy(
                            g, gx, gy, gr,
                            galaxies[i].tilt,
                            galaxies[i].baseAngle + t * galaxies[i].rotSpeed,
                            galaxies[i].r, galaxies[i].g, galaxies[i].b,
                            galVis * gDepth * 0.85f
                        );
                    }
                }

                // 4. Relativistic warp star-streaks (decelerating from 15s to 30s)
                float starStep = 2.8f + warp * 26.0f;
                float streakFactor = 0.4f + warp * 4.8f;
                for (int i = 0; i < stars.Length; i++)
                {
                    float pz = stars[i].z + starStep * streakFactor;
                    stars[i].z -= starStep;
                    if (stars[i].z <= 8f)
                    {
                        stars[i].z += 1400f;
                        pz = stars[i].z + starStep * streakFactor;
                    }
                    float z = stars[i].z;
                    float sx = camX + (stars[i].x / z) * 580f;
                    float sy = camY + (stars[i].y / z) * 580f;
                    if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

                    float px = camX + (stars[i].x / pz) * 580f;
                    float py = camY + (stars[i].y / pz) * 580f;
                    float depthAlpha = SmoothStep(1400f, 900f, z) * SmoothStep(8f, 95f, z);
                    int sa = Math.Max(0, Math.Min(255, (int)(depthAlpha * (145 + warp * 105))));
                    if (sa <= 4) continue;

                    float lw = stars[i].size * (0.65f + warp * 0.85f) * Math.Min(2.2f, 420f / (z + 180f));
                    using (Pen pen = new Pen(Color.FromArgb(sa, (int)stars[i].r, (int)stars[i].g, (int)stars[i].b), lw))
                    {
                        pen.StartCap = LineCap.Round;
                        pen.EndCap = LineCap.Round;
                        g.DrawLine(pen, px, py, sx, sy);
                    }
                }

                // 5. Act II & III (14s - 42s): Ignition & Growth of our Blazing Golden Sun
                if (t >= 13.5f)
                {
                    float sunIgnite = SmoothStep(13.5f, 17.5f, t);
                    float sunGrowP = SmoothStep(15.0f, 41.8f, t);
                    // Exponential growth as we approach our star from the Kuiper boundary
                    float sunRadius = 2.2f + (float)Math.Pow(sunGrowP, 3.1) * 320f + SmoothStep(15f, 30f, t) * 28f;
                    float coronaRadius = sunRadius * (4.8f + 2.2f * SmoothStep(30f, 42f, t));

                    // Outer golden-amber atmospheric glare
                    int outerA = Math.Max(0, Math.Min(255, (int)(sunIgnite * (110 + 135 * SmoothStep(28f, 41f, t)))));
                    DrawRadialGlow(
                        g, camX, camY, Math.Min(1600f, coronaRadius * 1.45f),
                        Color.FromArgb(outerA, 255, 185, 55),
                        Color.FromArgb(outerA / 2, 215, 95, 18),
                        0.45f
                    );

                    // Mid solar corona
                    int midA = Math.Max(0, Math.Min(255, (int)(sunIgnite * 235)));
                    DrawRadialGlow(
                        g, camX, camY, Math.Min(1100f, coronaRadius * 0.65f),
                        Color.FromArgb(midA, 255, 238, 155),
                        Color.FromArgb(midA / 2, 255, 160, 40),
                        0.55f
                    );

                    // Diagonal golden sunbeams ("...suspended in a sunbeam" 26s - 42s)
                    if (t >= 22f)
                    {
                        float beamP = SmoothStep(22f, 36f, t);
                        int beamA = Math.Max(0, Math.Min(140, (int)(beamP * 92)));
                        GraphicsState bs = g.Save();
                        g.TranslateTransform(camX, camY);
                        for (int b = 0; b < 8; b++)
                        {
                            float ang = b * 45f + t * 2.2f;
                            GraphicsState rs = g.Save();
                            g.RotateTransform(ang);
                            PointF[] rayPts = new PointF[] {
                                new PointF(0, -sunRadius * 0.25f),
                                new PointF(920f, -sunRadius * 1.65f - 55f),
                                new PointF(920f,  sunRadius * 1.65f + 55f),
                                new PointF(0,  sunRadius * 0.25f)
                            };
                            using (LinearGradientBrush lgb = new LinearGradientBrush(
                                new PointF(0, 0), new PointF(920f, 0),
                                Color.FromArgb(beamA, 255, 225, 130),
                                Color.FromArgb(0, 255, 170, 50)))
                            {
                                g.FillPolygon(lgb, rayPts);
                            }
                            g.Restore(rs);
                        }
                        g.Restore(bs);
                    }

                    // Anamorphic horizontal lens flare & 6-point star diffraction spikes
                    int spikeA = Math.Max(0, Math.Min(220, (int)(sunIgnite * 185)));
                    float spikeLen = Math.Min(900f, 45f + sunRadius * 4.2f);
                    using (Pen spikePen = new Pen(Color.FromArgb(spikeA, 255, 240, 195), Math.Max(1.5f, sunRadius * 0.06f)))
                    {
                        g.DrawLine(spikePen, camX - spikeLen, camY, camX + spikeLen, camY);
                    }
                    using (Pen spikePen2 = new Pen(Color.FromArgb(spikeA * 2 / 3, 255, 215, 140), Math.Max(1.0f, sunRadius * 0.035f)))
                    {
                        float dLen = spikeLen * 0.52f;
                        g.DrawLine(spikePen2, camX - dLen * 0.5f, camY - dLen * 0.86f, camX + dLen * 0.5f, camY + dLen * 0.86f);
                        g.DrawLine(spikePen2, camX - dLen * 0.5f, camY + dLen * 0.86f, camX + dLen * 0.5f, camY - dLen * 0.86f);
                    }

                    // Blazing photosphere core
                    DrawRadialGlow(
                        g, camX, camY, Math.Max(3f, sunRadius * 1.18f),
                        Color.FromArgb(255, 255, 255, 245),
                        Color.FromArgb(245, 255, 215, 110),
                        0.78f
                    );
                }

                // 6. Act III (29s - 41s): Outer Solar System Silhouettes & "Mote of Dust Suspended in a Sunbeam"
                if (t >= 28.5f && t <= 39.5f)
                {
                    // Distant ringed giant silhouette (Saturn) gliding past the left-lower quadrant catching golden rim light
                    float satP = (t - 28.5f) / 11.0f;
                    float satX = camX - 210f - satP * 440f;
                    float satY = camY + 65f + satP * 95f;
                    float satR = 14f + satP * 54f;
                    float satAlpha = SmoothStep(28.5f, 30.5f, t) * SmoothStep(39.5f, 37.0f, t);
                    if (satAlpha > 0.02f)
                    {
                        GraphicsState ss = g.Save();
                        g.TranslateTransform(satX, satY);
                        g.RotateTransform(-19f);
                        int rA = Math.Max(0, Math.Min(255, (int)(satAlpha * 185)));
                        using (Pen ringPen = new Pen(Color.FromArgb(rA, 245, 205, 135), Math.Max(2f, satR * 0.26f)))
                        {
                            g.DrawEllipse(ringPen, -satR * 2.35f, -satR * 0.52f, satR * 4.7f, satR * 1.04f);
                        }
                        using (SolidBrush bodyBrush = new SolidBrush(Color.FromArgb(Math.Min(255, (int)(satAlpha * 240)), 14, 18, 30)))
                        {
                            g.FillEllipse(bodyBrush, -satR, -satR, satR * 2f, satR * 2f);
                        }
                        using (Pen rimPen = new Pen(Color.FromArgb(rA, 255, 220, 145), Math.Max(1.5f, satR * 0.08f)))
                        {
                            g.DrawArc(rimPen, -satR, -satR, satR * 2f, satR * 2f, -70f, 140f);
                        }
                        g.Restore(ss);
                    }
                }

                // The "Pale Blue Dot" suspended in a golden sunbeam (34.5s - 40.8s)
                if (t >= 34.0f && t <= 41.2f)
                {
                    float dotVis = SmoothStep(34.0f, 36.2f, t) * SmoothStep(41.2f, 39.8f, t);
                    float dotX = camX + 215f + (t - 34f) * 8f;
                    float dotY = camY - 58f - (t - 34f) * 2.5f;
                    int dotA = Math.Max(0, Math.Min(255, (int)(dotVis * 245)));
                    DrawRadialGlow(
                        g, dotX, dotY, 26f,
                        Color.FromArgb(dotA, 150, 225, 255),
                        Color.FromArgb(dotA / 2, 30, 140, 255),
                        0.6f
                    );
                    using (SolidBrush db = new SolidBrush(Color.FromArgb(dotA, 225, 248, 255)))
                    {
                        g.FillEllipse(db, dotX - 3.2f, dotY - 3.2f, 6.4f, 6.4f);
                    }
                }

                // 7. Final Golden Solar Flare Crossfade Bloom (39.6s - 42.0s)
                if (t >= 39.4f)
                {
                    float flareP = SmoothStep(39.4f, 41.95f, t);
                    int flareA = Math.Max(0, Math.Min(255, (int)(Math.Pow(flareP, 1.55) * 255f)));
                    DrawRadialGlow(
                        g, camX, camY, 1550f,
                        Color.FromArgb(flareA, 255, 252, 232),
                        Color.FromArgb(flareA, 255, 195, 75),
                        0.65f
                    );
                    if (flareP > 0.45f)
                    {
                        int washA = Math.Max(0, Math.Min(255, (int)(SmoothStep(0.45f, 1.0f, flareP) * 255f)));
                        using (SolidBrush wb = new SolidBrush(Color.FromArgb(washA, 255, 246, 215)))
                        {
                            g.FillRectangle(wb, 0, 0, W, H);
                        }
                    }
                }

                // Subtle 2.39:1 cinema letterbox bars (fading into golden bloom at 40.5s-42s)
                int barAlpha = Math.Max(0, Math.Min(255, (int)((1f - SmoothStep(40.2f, 41.9f, t)) * 235f)));
                if (barAlpha > 2)
                {
                    using (SolidBrush lb = new SolidBrush(Color.FromArgb(barAlpha, 1, 3, 10)))
                    {
                        g.FillRectangle(lb, 0, 0, W, 44);
                        g.FillRectangle(lb, 0, H - 44, W, 44);
                    }
                }

                // Copy raw BGR24 frame to ffmpeg stdin
                BitmapData bd = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
                Marshal.Copy(bd.Scan0, frameBytes, 0, frameBytes.Length);
                bmp.UnlockBits(bd);
                stdin.Write(frameBytes, 0, frameBytes.Length);
                }
                stdin.Flush();
            }
            proc.WaitForExit();
            return proc.ExitCode;
        }
    }
}
