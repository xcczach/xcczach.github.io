体积视频 volumetric video  
- 6个自由度 6DoF ***剩下三个自由度是什么***
- every frame in a volumetric video consists of
a 3D scene represented by a point cloud or a polygon mesh
    - 点云 point cloud
        - 通俗解释：当一束激光照射到物体表面时，所反射的激光会携带方位、距离等信息。若将激光束按照某种轨迹进行扫描，便会边扫描边记录到反射的激光点信息，由于扫描极为精细，则能够得到大量的激光点，因而就可形成激光点云。
        - 数学解释：(x,y,z,激光反射强度/RGB)的数据集
    - polygon mesh
        - a collection of vertices, edges and faces that define the shape and surface of a 3D object
        - 参考链接：<https://3dstudio.co/polygon-mesh/>
    - 全景视频 panoramic videos
    - telepresence *在VR中的应用前景*
- 观看方式：VR/MR/PC
- 发展技术基础
    - 毫米波5G mmWave 5G ***信息传播技术发展速度会不会比编码技术发展更快？***



困难
- streaming high-quality volumetric videos over Internet is bandwidth-consuming(*hundreds of Mb/s*)
    - 流媒体 streaming media  
        - 媒体数据压缩->网上分段发送->网上即时传输
        - 优点：不必下载整个媒体文件
    - 带宽 bandwidth
        - 网络带宽：单位时间(1s)内能传输的数据量
        - 举例：1M宽带：1Mb/s=1024Kb/s=1024/8KB/s=128KB/s

CCS Concepts
- ACM论文中的分类系统